
const express = require('express');
const prisma = require('../db');

const router = express.Router();

// Generar lista de compras a partir del menú activo
router.post('/generar/:id_estudiante', async (req, res) => {
    try {
        const id_estudiante = Number(req.params.id_estudiante);

        if (!Number.isInteger(id_estudiante)) {
            return res.status(400).json({
                mensaje: 'Identificador de estudiante no válido'
            });
        }

        const plan = await prisma.planes_alimenticios.findFirst({
            where: {
                id_estudiante,
                estado: 'activo'
            },
            include: {
                comidas: {
                    include: {
                        detalle_comidas: {
                            include: {
                                alimento: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                fecha_creacion: 'desc'
            }
        });

        if (!plan) {
            return res.status(404).json({
                mensaje: 'Todavía no tienes un menú publicado'
            });
        }

        // Reunir y sumar ingredientes iguales
        const productos = new Map();

        for (const comida of plan.comidas) {
            for (const detalle of comida.detalle_comidas) {
                if (!detalle.alimento) continue;

                const alimento = detalle.alimento;
                const unidad = detalle.unidad || alimento.unidad_base;
                const clave = `${alimento.id_alimento}-${unidad}`;

                if (productos.has(clave)) {
                    productos.get(clave).cantidad += Number(detalle.cantidad);
                } else {
                    productos.set(clave, {
                        id_alimento: alimento.id_alimento,
                        producto: alimento.nombre,
                        categoria: alimento.categoria,
                        cantidad: Number(detalle.cantidad),
                        unidad
                    });
                }
            }
        }

        const listaProductos = Array.from(productos.values());

        if (listaProductos.length === 0) {
            return res.status(400).json({
                mensaje: 'El menú no contiene ingredientes para generar la lista'
            });
        }

        // Guardar o actualizar la lista de compras
        const lista = await prisma.$transaction(async (tx) => {

            const listaExistente = await tx.listas_compras.findFirst({
                where: {
                    id_estudiante,
                    id_plan: plan.id_plan
                },
                orderBy: {
                    fecha_creacion: 'desc'
                }
            });

            let id_lista;
            const estadosAnteriores = new Map();

            if (listaExistente) {
                id_lista = listaExistente.id_lista;

                const productosAnteriores = await tx.detalle_lista_compras.findMany({
                    where: { id_lista }
                });

                productosAnteriores.forEach(item => {
                    estadosAnteriores.set(
                        `${item.id_alimento}-${item.unidad}`,
                        item.comprado
                    );
                });

                await tx.detalle_lista_compras.deleteMany({
                    where: { id_lista }
                });

                await tx.listas_compras.update({
                    where: { id_lista },
                    data: {
                        estado: 'pendiente'
                    }
                });

            } else {
                const nuevaLista = await tx.listas_compras.create({
                    data: {
                        id_estudiante,
                        id_plan: plan.id_plan,
                        nombre: 'Lista de compras de mi menú',
                        estado: 'pendiente'
                    }
                });

                id_lista = nuevaLista.id_lista;
            }

            await tx.detalle_lista_compras.createMany({
                data: listaProductos.map(producto => ({
                    id_lista,
                    id_alimento: producto.id_alimento,
                    producto: producto.producto,
                    cantidad: producto.cantidad,
                    unidad: producto.unidad,
                    comprado: estadosAnteriores.get(
                        `${producto.id_alimento}-${producto.unidad}`
                    ) ?? false
                }))
            });

            return tx.detalle_lista_compras.findMany({
                where: { id_lista },
                orderBy: { producto: 'asc' }
            });
        });

        // Agregar categorías a la respuesta
        const respuesta = lista.map(item => {
            const producto = listaProductos.find(
                p => p.id_alimento === item.id_alimento &&
                    p.unidad === item.unidad
            );

            return {
                ...item,
                cantidad: Number(item.cantidad),
                categoria: producto ? producto.categoria : 'Otros'
            };
        });

        res.json({
            exitoso: true,
            mensaje: 'Lista de compras generada correctamente',
            id_plan: plan.id_plan,
            productos: respuesta
        });

    } catch (error) {
        console.error('Error al generar lista de compras:', error);

        res.status(500).json({
            mensaje: 'No se pudo generar la lista de compras',
            detalle: error.message
        });
    }
});

// Actualizar si un producto ya fue comprado
router.put('/producto/:id_detalle_lista', async (req, res) => {
    try {
        const id_detalle_lista = Number(req.params.id_detalle_lista);
        const { comprado } = req.body;

        if (!Number.isInteger(id_detalle_lista) || typeof comprado !== 'boolean') {
            return res.status(400).json({
                mensaje: 'Datos no válidos'
            });
        }

        const producto = await prisma.detalle_lista_compras.update({
            where: {
                id_detalle_lista
            },
            data: {
                comprado
            }
        });

        res.json({
            exitoso: true,
            mensaje: 'Producto actualizado correctamente',
            producto
        });

    } catch (error) {
        console.error('Error al actualizar producto:', error);

        res.status(500).json({
            mensaje: 'No se pudo actualizar el producto',
            detalle: error.message
        });
    }
});

module.exports = router;
