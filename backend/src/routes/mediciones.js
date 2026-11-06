
const express = require('express');
const router = express.Router();
const prisma = require('../db');
// Consultar historial de mediciones de un estudiante
router.get('/estudiante/:id_estudiante', async (req, res) => {
    try {
        const id_estudiante = Number(req.params.id_estudiante);

        const mediciones = await prisma.mediciones.findMany({
            where: {
                id_estudiante: id_estudiante
            },
            orderBy: {
                fecha_medicion: 'asc'
            }
        });

        res.json(mediciones);

    } catch (error) {
        console.error('Error al consultar mediciones:', error);

        res.status(500).json({
            mensaje: 'No se pudo consultar el historial de mediciones.'
        });
    }
});
// Registrar una medición de un estudiante
router.post('/', async (req, res) => {
    try {
        const {
            id_estudiante,
            id_consulta,
            fecha_medicion,
            peso_kg,
            estatura_cm,
            porcentaje_grasa,
            observaciones
        } = req.body;

        if (!id_estudiante || !fecha_medicion) {
            return res.status(400).json({
                mensaje: 'El estudiante y la fecha son obligatorios.'
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

        const medicion = await prisma.mediciones.create({
            data: {
                id_estudiante: Number(id_estudiante),
                id_consulta: id_consulta
                    ? Number(id_consulta)
                    : null,
                fecha_medicion: new Date(`${fecha_medicion}T12:00:00`),
                peso_kg: peso_kg !== undefined && peso_kg !== null
                    ? Number(peso_kg)
                    : null,
                estatura_cm: estatura_cm !== undefined && estatura_cm !== null
                    ? Number(estatura_cm)
                    : null,
                porcentaje_grasa: porcentaje_grasa !== undefined && porcentaje_grasa !== null
                    ? Number(porcentaje_grasa)
                    : null,
                observaciones: observaciones || null
            }
        });

        res.status(201).json({
            mensaje: 'Medición registrada correctamente.',
            medicion
        });

    } catch (error) {
        console.error('Error al registrar medición:', error);

        res.status(500).json({
            mensaje: 'No se pudo registrar la medición.'
        });
    }
});

module.exports = router;
