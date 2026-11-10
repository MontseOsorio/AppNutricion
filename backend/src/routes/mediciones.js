
const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Consultar historial de mediciones de un estudiante
router.get('/estudiante/:id_estudiante', async (req, res) => {
    try {
        const id_estudiante = Number(req.params.id_estudiante);

        if (!Number.isInteger(id_estudiante) || id_estudiante <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del estudiante no es válido.'
            });
        }

        const mediciones = await prisma.mediciones.findMany({
            where: { id_estudiante },
            orderBy: [
                { fecha_medicion: 'desc' },
                { id_medicion: 'desc' }
            ]
        });

        res.json(mediciones);

    } catch (error) {
        console.error('Error al consultar mediciones:', error);

        res.status(500).json({
            mensaje: 'No se pudo consultar el historial de mediciones.'
        });
    }
});

// Registrar una nueva medición
router.post('/', async (req, res) => {
    try {
        const {
            id_estudiante,
            id_consulta,
            fecha_medicion,
            peso_kg,
            estatura_cm,
            porcentaje_grasa,
            masa_grasa_kg,
            porcentaje_agua,
            agua_corporal_kg,
            masa_muscular_kg,
            masa_osea_kg,
            edad_metabolica,
            grasa_visceral,
            sexo,
            edad,
            observaciones
        } = req.body;

        const estudianteId = Number(id_estudiante);

        if (!Number.isInteger(estudianteId) || estudianteId <= 0 || !fecha_medicion) {
            return res.status(400).json({
                mensaje: 'El estudiante y la fecha son obligatorios.'
            });
        }

        const fecha = new Date(`${fecha_medicion}T12:00:00`);

        if (Number.isNaN(fecha.getTime())) {
            return res.status(400).json({
                mensaje: 'La fecha de medición no es válida.'
            });
        }

        const estudiante = await prisma.usuarios.findFirst({
            where: {
                id_usuario: estudianteId,
                rol: 'estudiante',
                activo: true
            }
        });

        if (!estudiante) {
            return res.status(404).json({
                mensaje: 'No se encontró el estudiante.'
            });
        }

        // Convertir campos numéricos opcionales
        const numero = (valor) => {
            if (valor === undefined || valor === null || valor === '') {
                return null;
            }

            const resultado = Number(valor);

            if (!Number.isFinite(resultado)) {
                throw new Error('Uno de los valores numéricos no es válido.');
            }

            return resultado;
        };

        const peso = numero(peso_kg);
        const estatura = numero(estatura_cm);

        // Calcular IMC automáticamente
        const imc = peso !== null && estatura !== null && estatura > 0
            ? Number((peso / ((estatura / 100) ** 2)).toFixed(2))
            : null;

        const medicion = await prisma.mediciones.create({
            data: {
                id_estudiante: estudianteId,
                id_consulta: id_consulta ? Number(id_consulta) : null,
                fecha_medicion: fecha,

                peso_kg: peso,
                estatura_cm: estatura,
                imc,

                porcentaje_grasa: numero(porcentaje_grasa),
                masa_grasa_kg: numero(masa_grasa_kg),

                porcentaje_agua: numero(porcentaje_agua),
                agua_corporal_kg: numero(agua_corporal_kg),
                masa_muscular_kg: numero(masa_muscular_kg),
                masa_osea_kg: numero(masa_osea_kg),

                edad_metabolica: edad_metabolica === '' || edad_metabolica == null
                    ? null
                    : Number(edad_metabolica),

                grasa_visceral: numero(grasa_visceral),
                sexo: sexo || null,

                edad: edad === '' || edad == null
                    ? null
                    : Number(edad),

                observaciones: observaciones || null
            }
        });

        res.status(201).json({
            mensaje: 'Medición registrada correctamente.',
            medicion
        });

    } catch (error) {
        console.error('Error al registrar medición:', error);

        res.status(400).json({
            mensaje: error.message || 'No se pudo registrar la medición.'
        });
    }
});

module.exports = router;
