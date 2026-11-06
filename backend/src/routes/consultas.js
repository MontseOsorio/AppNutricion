
const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Registrar una consulta nutricional con sus mediciones
router.post('/', async (req, res) => {
    try {
        const {
            id_cita,
            id_estudiante,
            id_nutriologa,
            fecha_consulta,
            motivo,
            observaciones,
            diagnostico_nutricional,
            recomendaciones,
            seguimiento,
            peso_kg,
            estatura_cm,
            porcentaje_grasa,
            observaciones_medicion
        } = req.body;

        if (!id_estudiante || !id_nutriologa || !fecha_consulta) {
            return res.status(400).json({
                mensaje: 'El estudiante, la nutrióloga y la fecha son obligatorios.'
            });
        }

        // Comprobar que el estudiante exista
        const estudiante = await prisma.usuarios.findFirst({
            where: {
                id_usuario: Number(id_estudiante),
                rol: 'estudiante',
                activo: true
            }
        });

        if (!estudiante) {
            return res.status(404).json({
                mensaje: 'No se encontró al estudiante.'
            });
        }

        // Comprobar que la nutrióloga exista
        const nutriologa = await prisma.usuarios.findFirst({
            where: {
                id_usuario: Number(id_nutriologa),
                rol: 'nutriologa',
                activo: true
            }
        });

        if (!nutriologa) {
            return res.status(404).json({
                mensaje: 'No se encontró a la nutrióloga.'
            });
        }

        // Comprobar la cita, si se proporciona
        if (id_cita) {
            const cita = await prisma.citas.findFirst({
                where: {
                    id_cita: Number(id_cita),
                    id_estudiante: Number(id_estudiante),
                    id_nutriologa: Number(id_nutriologa),
                    estado: 'confirmada'
                }
            });

            if (!cita) {
                return res.status(404).json({
                    mensaje: 'No se encontró una cita confirmada para este estudiante.'
                });
            }
        }

        // Guardar consulta y medición en una sola transacción
        const resultado = await prisma.$transaction(async (tx) => {

            const consulta = await tx.consultas.create({
                data: {
                    id_cita: id_cita ? Number(id_cita) : null,
                    id_estudiante: Number(id_estudiante),
                    id_nutriologa: Number(id_nutriologa),
                    fecha_consulta: new Date(fecha_consulta),
                    motivo: motivo || null,
                    observaciones: observaciones || null,
                    diagnostico_nutricional: diagnostico_nutricional || null,
                    recomendaciones: recomendaciones || null,
                    seguimiento: seguimiento || null
                }
            });

            // Registrar medición si se proporcionó algún dato
            const tieneMedicion =
                peso_kg !== undefined && peso_kg !== null && peso_kg !== '' ||
                estatura_cm !== undefined && estatura_cm !== null && estatura_cm !== '' ||
                porcentaje_grasa !== undefined && porcentaje_grasa !== null && porcentaje_grasa !== '';

            let medicion = null;

            if (tieneMedicion) {
                medicion = await tx.mediciones.create({
                    data: {
                        id_estudiante: Number(id_estudiante),
                        id_consulta: consulta.id_consulta,
                        fecha_medicion: new Date(`${fecha_consulta.slice(0, 10)}T12:00:00`),
                        peso_kg: peso_kg !== undefined && peso_kg !== null && peso_kg !== ''
                            ? Number(peso_kg)
                            : null,
                        estatura_cm: estatura_cm !== undefined && estatura_cm !== null && estatura_cm !== ''
                            ? Number(estatura_cm)
                            : null,
                        porcentaje_grasa: porcentaje_grasa !== undefined && porcentaje_grasa !== null && porcentaje_grasa !== ''
                            ? Number(porcentaje_grasa)
                            : null,
                        observaciones: observaciones_medicion || null
                    }
                });
            }

            return { consulta, medicion };
        });

        res.status(201).json({
            mensaje: 'Consulta registrada correctamente.',
            consulta: resultado.consulta,
            medicion: resultado.medicion
        });

    } catch (error) {
        console.error('Error al registrar consulta:', error);

        res.status(500).json({
            mensaje: 'No se pudo registrar la consulta.'
        });
    }
});

// Consultar historial de consultas de un estudiante
router.get('/estudiante/:id_estudiante', async (req, res) => {
    try {
        const id_estudiante = Number(req.params.id_estudiante);

        const consultas = await prisma.consultas.findMany({
            where: {
                id_estudiante: id_estudiante
            },
            include: {
                // No hay relaciones Prisma definidas,
                // por eso consultamos las mediciones por separado.
            },
            orderBy: {
                fecha_consulta: 'desc'
            }
        });

        const historial = await Promise.all(
            consultas.map(async (consulta) => {
                const mediciones = await prisma.mediciones.findMany({
                    where: {
                        id_consulta: consulta.id_consulta
                    }
                });

                return {
                    ...consulta,
                    mediciones
                };
            })
        );

        res.json(historial);

    } catch (error) {
        console.error('Error al consultar historial:', error);

        res.status(500).json({
            mensaje: 'No se pudo consultar el historial de consultas.'
        });
    }
});

module.exports = router;
