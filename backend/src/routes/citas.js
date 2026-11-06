
const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Registrar una cita
router.post('/', async (req, res) => {
    try {
        const {
            id_estudiante,
            id_nutriologa,
            fecha,
            hora
        } = req.body;

        // Validar datos
        if (!id_estudiante || !id_nutriologa || !fecha || !hora) {
            return res.status(400).json({
                mensaje: 'Faltan datos para registrar la cita'
            });
        }

        // Comprobar que el estudiante exista
        const estudiante = await prisma.usuarios.findUnique({
            where: {
                id_usuario: Number(id_estudiante)
            }
        });

        if (!estudiante || estudiante.rol !== 'estudiante') {
            return res.status(404).json({
                mensaje: 'No se encontró al estudiante'
            });
        }

        // Comprobar que la nutrióloga exista
        const nutriologa = await prisma.usuarios.findUnique({
            where: {
                id_usuario: Number(id_nutriologa)
            }
        });

        if (!nutriologa || nutriologa.rol !== 'nutriologa') {
            return res.status(404).json({
                mensaje: 'No se encontró a la nutrióloga'
            });
        }

        // Comprobar si el horario ya está reservado
const fechaCita = new Date(`${fecha}T12:00:00`);
const horaCita = new Date(`1970-01-01T${hora}:00`);

// Convertir la hora al formato que guarda MySQL
const horaGuardada = horaCita.toISOString().slice(11, 19);

const citaExistente = await prisma.$queryRaw`
    SELECT id_cita
    FROM citas
    WHERE id_nutriologa = ${Number(id_nutriologa)}
    AND fecha = ${fecha}
    AND hora = ${horaGuardada}
    AND estado IN ('pendiente', 'confirmada')
    LIMIT 1
`;

if (citaExistente.length > 0) {
    return res.status(409).json({
        mensaje: 'Este horario ya fue reservado. Selecciona otro horario.'
    });
}
      // Guardar fecha y hora
const nuevaCita = await prisma.citas.create({
    data: {
        id_estudiante: Number(id_estudiante),
        id_nutriologa: Number(id_nutriologa),
        fecha: fechaCita,
        hora: horaCita,
        estado: 'pendiente'
    }
});

        res.status(201).json({
            mensaje: 'Cita registrada correctamente',
            cita: nuevaCita
        });

    } catch (error) {
        console.error('Error al registrar cita:', error);

        res.status(500).json({
            mensaje: 'Error al registrar la cita'
        });
    }
});
// Consultar las citas de una nutrióloga
router.get('/:idNutriologa', async (req, res) => {
    try {
        const idNutriologa = Number(req.params.idNutriologa);

        const citas = await prisma.$queryRaw`
            SELECT
                c.id_cita,
                c.id_estudiante,
                DATE_FORMAT(c.fecha, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(c.hora, '%H:%i') AS hora,
                c.estado,
                c.motivo,
                u.nombre,
                u.apellidos,
                u.correo
            FROM citas c
            INNER JOIN usuarios u
                ON c.id_estudiante = u.id_usuario
            WHERE c.id_nutriologa = ${idNutriologa}
            ORDER BY c.fecha ASC, c.hora ASC
        `;

        res.json(citas);

    } catch (error) {
        console.error('Error al consultar citas:', error);

        res.status(500).json({
            mensaje: 'No se pudieron consultar las citas'
        });
    }
});

// Confirmar o cancelar una cita
router.put('/:idNutriologa/:idCita/estado', async (req, res) => {
    try {
        const idNutriologa = Number(req.params.idNutriologa);
        const idCita = Number(req.params.idCita);
        const { estado } = req.body;

        if (!['confirmada', 'cancelada'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado de cita no válido'
            });
        }

        const cita = await prisma.citas.findFirst({
            where: {
                id_cita: idCita,
                id_nutriologa: idNutriologa
            }
        });

        if (!cita) {
            return res.status(404).json({
                mensaje: 'No se encontró la cita'
            });
        }

        if (cita.estado !== 'pendiente') {
            return res.status(400).json({
                mensaje: 'Esta cita ya fue atendida o modificada'
            });
        }

        const citaActualizada = await prisma.citas.update({
            where: {
                id_cita: idCita
            },
            data: {
                estado
            }
        });

        res.json({
            mensaje: estado === 'confirmada'
                ? 'Cita confirmada correctamente'
                : 'Cita cancelada correctamente',
            cita: citaActualizada
        });

    } catch (error) {
        console.error('Error al actualizar cita:', error);

        res.status(500).json({
            mensaje: 'No se pudo actualizar la cita'
        });
    }
});

module.exports = router;
