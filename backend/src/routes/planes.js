
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
// Consultar planes de un estudiante
router.get('/estudiante/:id_estudiante', async (req, res) => {

    try {
        const id_estudiante = Number(req.params.id_estudiante);

        const planes = await prisma.planes_alimenticios.findMany({
            where: {
                id_estudiante
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
// Publicar un plan alimenticio
router.put('/:id_plan/publicar', async (req, res) => {
    try {
        const id_plan = Number(req.params.id_plan);

        const plan = await prisma.planes_alimenticios.findUnique({
            where: {
                id_plan
            }
        });

        if (!plan) {
            return res.status(404).json({
                mensaje: 'No se encontró el plan alimenticio.'
            });
        }

        await prisma.$transaction([
            prisma.planes_alimenticios.updateMany({
                where: {
                    id_estudiante: plan.id_estudiante,
                    estado: 'activo'
                },
                data: {
                    estado: 'finalizado'
                }
            }),

            prisma.planes_alimenticios.update({
                where: {
                    id_plan
                },
                data: {
                    estado: 'activo'
                }
            })
        ]);

        res.json({
            mensaje: 'Plan alimenticio publicado correctamente.'
        });

    } catch (error) {
        console.error('Error al publicar plan:', error);

        res.status(500).json({
            mensaje: 'No se pudo publicar el plan alimenticio.'
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

module.exports = router;
