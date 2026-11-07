
const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Consultar estudiantes registrados
router.get('/estudiantes', async (req, res) => {
    try {
        const estudiantes = await prisma.usuarios.findMany({
            where: {
                rol: 'estudiante',
                activo: true
            },
            select: {
                id_usuario: true,
                nombre: true,
                apellidos: true,
                correo: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        res.json(estudiantes);

    } catch (error) {
        console.error('Error al consultar estudiantes:', error);
        res.status(500).json({
            mensaje: 'No se pudieron consultar los estudiantes.'
        });
    }
});
// Consultar planes de un estudiante con sus comidas y alimentos
router.get('/estudiante/:id_estudiante', async (req, res) => {
    try {
        const id_estudiante = Number(req.params.id_estudiante);

        const planes = await prisma.planes_alimenticios.findMany({
            where: {
                id_estudiante
            },
            include: {
                comidas: {
                    orderBy: {
                        dia_plan: 'asc'
                    },
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

        res.json(planes);

    } catch (error) {
        console.error('Error al consultar planes:', error);

        res.status(500).json({
            mensaje: 'No se pudieron consultar los planes.'
        });
    }
});

// Consultar catálogo de alimentos
router.get('/alimentos', async (req, res) => {
    try {
        const alimentos = await prisma.alimentos.findMany({
            where: {
                activo: true
            },
            select: {
                id_alimento: true,
                nombre: true,
                categoria: true,
                unidad_base: true,
                calorias: true,
                proteinas_g: true,
                carbohidratos_g: true,
                grasas_g: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        res.json(alimentos);

    } catch (error) {
        console.error('Error al consultar alimentos:', error);

        res.status(500).json({
            mensaje: 'No se pudo consultar el catálogo de alimentos.'
        });
    }
});
// Publicar o actualizar un plan alimenticio
router.put('/:id_plan/publicar', async (req, res) => {
    try {
        const id_plan = Number(req.params.id_plan);

        const plan = await prisma.planes_alimenticios.findUnique({
            where: { id_plan }
        });

        if (!plan) {
            return res.status(404).json({
                mensaje: 'No se encontró el plan alimenticio.'
            });
        }

        if (!['borrador', 'activo'].includes(plan.estado)) {
            return res.status(400).json({
                mensaje: 'Este plan ya está finalizado y no se puede publicar.'
            });
        }

        await prisma.$transaction([
            prisma.planes_alimenticios.updateMany({
                where: {
                    id_estudiante: plan.id_estudiante,
                    estado: 'activo',
                    id_plan: { not: id_plan }
                },
                data: {
                    estado: 'finalizado'
                }
            }),

            prisma.planes_alimenticios.update({
                where: { id_plan },
                data: {
                    estado: 'activo'
                }
            })
        ]);

        res.json({
            mensaje: 'Plan alimenticio publicado o actualizado correctamente.'
        });

    } catch (error) {
        console.error('Error al publicar plan:', error);

        res.status(500).json({
            mensaje: 'No se pudo publicar el plan alimenticio.'
        });
    }
});

// Copiar las comidas de un plan a otro
router.post('/:id_plan_destino/copiar-comidas/:id_plan_origen', async (req, res) => {
    try {
        const id_plan_destino = Number(req.params.id_plan_destino);
        const id_plan_origen = Number(req.params.id_plan_origen);

        if (
            !Number.isInteger(id_plan_destino) ||
            !Number.isInteger(id_plan_origen) ||
            id_plan_destino === id_plan_origen
        ) {
            return res.status(400).json({
                mensaje: 'Los planes indicados no son válidos.'
            });
        }

        const resultado = await prisma.$transaction(async (tx) => {
            const [destino, origen] = await Promise.all([
                tx.planes_alimenticios.findUnique({
                    where: { id_plan: id_plan_destino }
                }),
                tx.planes_alimenticios.findUnique({
                    where: { id_plan: id_plan_origen },
                    include: {
                        comidas: {
                            where: { dia_plan: 1 },
                            include: {
                                detalle_comidas: true
                            }
                        }
                    }
                })
            ]);

            if (!destino || !origen) {
                throw new Error('PLAN_NO_ENCONTRADO');
            }

            if (destino.id_estudiante !== origen.id_estudiante) {
                throw new Error('ESTUDIANTE_DISTINTO');
            }

            if (destino.estado !== 'activo') {
                throw new Error('DESTINO_NO_ACTIVO');
            }

            const comidasLunes = origen.comidas;

            if (comidasLunes.length === 0) {
                throw new Error('SIN_COMIDAS');
            }

            // Evitar copiar comidas duplicadas del mismo día y tipo.
            const existentes = await tx.comidas.findMany({
                where: {
                    id_plan: id_plan_destino,
                    dia_plan: 1
                },
                select: {
                    nombre: true,
                    tipo: true
                }
            });

            const duplicadas = comidasLunes.filter(origenComida =>
                existentes.some(destinoComida =>
                    destinoComida.nombre.trim().toLowerCase() ===
                        origenComida.nombre.trim().toLowerCase() &&
                    destinoComida.tipo === origenComida.tipo
                )
            );

            if (duplicadas.length > 0) {
                throw new Error('COMIDAS_DUPLICADAS');
            }

            for (const comidaOrigen of comidasLunes) {
                const nuevaComida = await tx.comidas.create({
                    data: {
                        id_plan: id_plan_destino,
                        nombre: comidaOrigen.nombre,
                        tipo: comidaOrigen.tipo,
                        dia_plan: comidaOrigen.dia_plan,
                        hora_sugerida: comidaOrigen.hora_sugerida,
                        instrucciones: comidaOrigen.instrucciones
                    }
                });

                if (comidaOrigen.detalle_comidas.length > 0) {
                    await tx.detalle_comidas.createMany({
                        data: comidaOrigen.detalle_comidas.map(detalle => ({
                            id_comida: nuevaComida.id_comida,
                            id_alimento: detalle.id_alimento,
                            cantidad: detalle.cantidad,
                            unidad: detalle.unidad,
                            indicaciones: detalle.indicaciones
                        }))
                    });
                }
            }

            return {
                comidasCopiadas: comidasLunes.length
            };
        });

        res.json({
            mensaje: 'Las comidas del lunes se copiaron correctamente al plan principal.',
            ...resultado
        });

    } catch (error) {
        console.error('Error al copiar comidas:', error);

        const errores = {
            PLAN_NO_ENCONTRADO: [404, 'No se encontró alguno de los planes.'],
            ESTUDIANTE_DISTINTO: [400, 'Los planes pertenecen a estudiantes diferentes.'],
            DESTINO_NO_ACTIVO: [400, 'El plan principal debe estar activo.'],
            SIN_COMIDAS: [400, 'El plan de origen no tiene comidas del lunes.'],
            COMIDAS_DUPLICADAS: [409, 'Ya existen comidas del mismo nombre y tipo el lunes. No se realizó ninguna copia.']
        };

        const errorConocido = errores[error.message];

        if (errorConocido) {
            return res.status(errorConocido[0]).json({
                mensaje: errorConocido[1]
            });
        }

        res.status(500).json({
            mensaje: 'No se pudieron copiar las comidas.'
        });
    }
});

// Crear un nuevo plan alimenticio
router.post('/', async (req, res) => {
    try {
        const {
            id_estudiante,
            id_nutriologa,
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            calorias_objetivo
        } = req.body;

        if (!id_estudiante || !id_nutriologa || !nombre || !fecha_inicio) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios.'
            });
        }

        const estudiante = await prisma.usuarios.findFirst({
            where: {
                id_usuario: Number(id_estudiante),
                rol: 'estudiante',
                activo: true
            }
        });

        if (!estudiante) {
            return res.status(404).json({
                mensaje: 'No se encontró el estudiante.'
            });
        }

        const nutriologa = await prisma.usuarios.findFirst({
            where: {
                id_usuario: Number(id_nutriologa),
                rol: 'nutriologa',
                activo: true
            }
        });

        if (!nutriologa) {
            return res.status(404).json({
                mensaje: 'No se encontró la nutrióloga.'
            });
        }

        const nuevoPlan = await prisma.planes_alimenticios.create({
            data: {
                id_estudiante: Number(id_estudiante),
                id_nutriologa: Number(id_nutriologa),
                nombre,
                descripcion: descripcion || null,
                fecha_inicio: new Date(`${fecha_inicio}T12:00:00`),
                fecha_fin: fecha_fin
                    ? new Date(`${fecha_fin}T12:00:00`)
                    : null,
                calorias_objetivo: calorias_objetivo
                    ? Number(calorias_objetivo)
                    : null,
                estado: 'borrador'
            }
        });

        res.status(201).json({
            mensaje: 'Plan alimenticio creado correctamente.',
            plan: nuevoPlan
        });

    } catch (error) {
        console.error('Error al crear plan:', error);

        res.status(500).json({
            mensaje: 'No se pudo crear el plan alimenticio.'
        });
    }
});
// Editar una comida existente
router.put('/:id_plan/comidas/:id_comida', async (req, res) => {
    try {
        const id_plan = Number(req.params.id_plan);
        const id_comida = Number(req.params.id_comida);

        const {
            nombre,
            tipo,
            dia_plan,
            instrucciones,
            alimentos
        } = req.body;

        const tiposPermitidos = ['desayuno', 'comida', 'cena', 'colacion'];

        if (
            !nombre ||
            !tiposPermitidos.includes(tipo) ||
            !Number.isInteger(Number(dia_plan)) ||
            Number(dia_plan) < 1 ||
            !Array.isArray(alimentos) ||
            alimentos.length === 0
        ) {
            return res.status(400).json({
                mensaje: 'Revisa los datos de la comida.'
            });
        }

        const comidaExistente = await prisma.comidas.findFirst({
            where: {
                id_comida,
                id_plan
            }
        });

        if (!comidaExistente) {
            return res.status(404).json({
                mensaje: 'No se encontró la comida.'
            });
        }

        for (const alimento of alimentos) {
            if (
                !Number.isInteger(Number(alimento.id_alimento)) ||
                !Number.isFinite(Number(alimento.cantidad)) ||
                Number(alimento.cantidad) <= 0 ||
                !alimento.unidad
            ) {
                return res.status(400).json({
                    mensaje: 'Revisa las cantidades y unidades de los alimentos.'
                });
            }
        }

        const idsAlimentos = alimentos.map(a => Number(a.id_alimento));

        const alimentosExistentes = await prisma.alimentos.findMany({
            where: {
                id_alimento: { in: idsAlimentos },
                activo: true
            },
            select: {
                id_alimento: true
            }
        });

        if (alimentosExistentes.length !== new Set(idsAlimentos).size) {
            return res.status(400).json({
                mensaje: 'Uno o más alimentos no existen o están inactivos.'
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.comidas.update({
                where: { id_comida },
                data: {
                    nombre,
                    tipo,
                    dia_plan: Number(dia_plan),
                    instrucciones: instrucciones || null
                }
            });

            await tx.detalle_comidas.deleteMany({
                where: { id_comida }
            });

            await tx.detalle_comidas.createMany({
                data: alimentos.map(alimento => ({
                    id_comida,
                    id_alimento: Number(alimento.id_alimento),
                    cantidad: Number(alimento.cantidad),
                    unidad: alimento.unidad,
                    indicaciones: alimento.indicaciones || null
                }))
            });
        });

        res.json({
            mensaje: 'Comida actualizada correctamente.'
        });

    } catch (error) {
        console.error('Error al editar comida:', error);

        res.status(500).json({
            mensaje: 'No se pudo actualizar la comida.'
        });
    }
});
// Agregar una comida a un plan alimenticio
router.post('/:id_plan/comidas', async (req, res) => {
    try {
        const id_plan = Number(req.params.id_plan);
        const {
            nombre,
            tipo,
            dia_plan,
            instrucciones,
            alimentos
        } = req.body;

        if (!nombre || !tipo || !Array.isArray(alimentos) || alimentos.length === 0) {
            return res.status(400).json({
                mensaje: 'Debes ingresar el nombre, tipo y al menos un alimento.'
            });
        }

        const tiposPermitidos = ['desayuno', 'comida', 'cena', 'colacion'];

        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({
                mensaje: 'El tipo de comida no es válido.'
            });
        }

        const plan = await prisma.planes_alimenticios.findUnique({
            where: { id_plan }
        });

        if (!plan) {
            return res.status(404).json({
                mensaje: 'No se encontró el plan alimenticio.'
            });
        }

        for (const alimento of alimentos) {
            if (
                !Number.isInteger(Number(alimento.id_alimento)) ||
                !Number.isFinite(Number(alimento.cantidad)) ||
                Number(alimento.cantidad) <= 0 ||
                !alimento.unidad
            ) {
                return res.status(400).json({
                    mensaje: 'Revisa los alimentos, cantidades y unidades.'
                });
            }
        }

        const idsAlimentos = alimentos.map(a => Number(a.id_alimento));

        const alimentosExistentes = await prisma.alimentos.findMany({
            where: {
                id_alimento: { in: idsAlimentos },
                activo: true
            },
            select: { id_alimento: true }
        });

        if (alimentosExistentes.length !== new Set(idsAlimentos).size) {
            return res.status(400).json({
                mensaje: 'Uno o más alimentos no existen o están inactivos.'
            });
        }

        const nuevaComida = await prisma.$transaction(async (tx) => {
            const comida = await tx.comidas.create({
                data: {
                    id_plan,
                    nombre,
                    tipo,
                    dia_plan: dia_plan ? Number(dia_plan) : 1,
                    instrucciones: instrucciones || null
                }
            });

            await tx.detalle_comidas.createMany({
                data: alimentos.map(alimento => ({
                    id_comida: comida.id_comida,
                    id_alimento: Number(alimento.id_alimento),
                    cantidad: Number(alimento.cantidad),
                    unidad: alimento.unidad,
                    indicaciones: alimento.indicaciones || null
                }))
            });

            return comida;
        });

        res.status(201).json({
            mensaje: 'Comida agregada correctamente.',
            comida: nuevaComida
        });

    } catch (error) {
        console.error('Error al agregar comida:', error);

        res.status(500).json({
            mensaje: 'No se pudo agregar la comida.'
        });
    }
});

module.exports = router;
