const express = require('express');
const prisma = require('../db');

const router = express.Router();

// Obtener las tomas de agua de hoy
router.get('/:idUsuario', async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);

    const hoy = new Date();
    const inicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
    const fin = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );

    const registros = await prisma.registro_agua.findMany({
      where: {
        id_usuario: idUsuario,
        fecha_hora: {
          gte: inicio,
          lt: fin
        }
      }
    });

    res.json(registros);
  } catch (error) {
    console.error('Error al consultar agua:', error);
    res.status(500).json({ mensaje: 'Error al consultar las tomas de agua.' });
  }
});

// Registrar una toma de agua
router.post('/', async (req, res) => {
  try {
    const { id_usuario, numero_toma } = req.body;

    if (!id_usuario || numero_toma < 0 || numero_toma > 7) {
      return res.status(400).json({
        mensaje: 'Datos de la toma incorrectos.'
      });
    }

    const hoy = new Date();
    const inicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
    const fin = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );

    const observaciones = `Toma ${numero_toma + 1}`;

    const existente = await prisma.registro_agua.findFirst({
      where: {
        id_usuario,
        observaciones,
        fecha_hora: {
          gte: inicio,
          lt: fin
        }
      }
    });

    if (existente) {
      return res.status(409).json({
        mensaje: 'Esta toma ya fue registrada.'
      });
    }

    const registro = await prisma.registro_agua.create({
      data: {
        id_usuario,
        cantidad_ml: 250,
        observaciones
      }
    });

    res.status(201).json({
      mensaje: 'Toma de agua registrada.',
      registro
    });
  } catch (error) {
    console.error('Error al registrar agua:', error);
    res.status(500).json({ mensaje: 'Error al registrar la toma de agua.' });
  }
});

// Eliminar una toma registrada
router.delete('/:idUsuario/:numeroToma', async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);
    const numeroToma = Number(req.params.numeroToma);

    const hoy = new Date();
    const inicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
    const fin = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );

    const registro = await prisma.registro_agua.findFirst({
      where: {
        id_usuario: idUsuario,
        observaciones: `Toma ${numeroToma + 1}`,
        fecha_hora: {
          gte: inicio,
          lt: fin
        }
      }
    });

    if (!registro) {
      return res.status(404).json({
        mensaje: 'No se encontró esta toma.'
      });
    }

    await prisma.registro_agua.delete({
      where: { id_registro_agua: registro.id_registro_agua }
    });

    res.json({ mensaje: 'Toma eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar agua:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la toma.' });
  }
});

module.exports = router;