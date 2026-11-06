
const express = require('express');
const prisma = require('../db');

const router = express.Router();

// Consultar disponibilidad de la nutrióloga
router.get('/:idNutriologa', async (req, res) => {
    try {
        const idNutriologa = Number(req.params.idNutriologa);

        const horarios = await prisma.disponibilidad.findMany({
            where: {
                id_nutriologa: idNutriologa
            },
            orderBy: [
                { dia_semana: 'asc' },
                { hora_inicio: 'asc' }
            ]
        });

        res.json(horarios);

    } catch (error) {
        console.error('Error al consultar disponibilidad:', error);
        res.status(500).json({
            mensaje: 'No se pudieron consultar los horarios'
        });
    }
});

// Registrar disponibilidad
router.post('/', async (req, res) => {
    try {
        const {
            id_nutriologa,
            dia_semana,
            hora_inicio,
            hora_fin
        } = req.body;

        if (!id_nutriologa || !dia_semana || !hora_inicio || !hora_fin) {
            return res.status(400).json({
                mensaje: 'Completa todos los campos'
            });
        }

        const diasValidos = [
            'lunes', 'martes', 'miercoles',
            'jueves', 'viernes'
        ];

        if (!diasValidos.includes(dia_semana)) {
            return res.status(400).json({
                mensaje: 'Día de la semana no válido'
            });
        }

        if (hora_inicio >= hora_fin) {
            return res.status(400).json({
                mensaje: 'La hora de inicio debe ser anterior a la hora final'
            });
        }

        const horario = await prisma.disponibilidad.create({
            data: {
                id_nutriologa: Number(id_nutriologa),
                dia_semana,
                hora_inicio: new Date(`1970-01-01T${hora_inicio}:00`),
                hora_fin: new Date(`1970-01-01T${hora_fin}:00`),
                disponible: true
            }
        });

        res.status(201).json({
            mensaje: 'Horario registrado correctamente',
            horario
        });

    } catch (error) {
        console.error('Error al registrar disponibilidad:', error);
        res.status(500).json({
            mensaje: 'No se pudo registrar el horario'
        });
    }
});

module.exports = router;
