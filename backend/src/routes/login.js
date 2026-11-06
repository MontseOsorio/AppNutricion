
const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db');

const router = express.Router();

// Inicio de sesión para estudiantes y nutrióloga
router.post('/', async (req, res) => {
    try {
        const { expediente, contrasena, correo } = req.body;
        console.log('LOGIN RECIBIDO:', {
    expediente,
    correo,
    tieneContrasena: !!contrasena
});

        if (!contrasena) {
            return res.status(400).json({
                mensaje: 'Ingresa tu contraseña'
            });
        }

        let usuario;
        let perfil = null;

        // Si ingresa correo, buscar cuenta de nutrióloga
        if (correo) {
            usuario = await prisma.usuarios.findUnique({
                where: {
                    correo: correo.trim().toLowerCase()
                }
            });

            if (!usuario || usuario.rol !== 'nutriologa') {
                return res.status(401).json({
                    mensaje: 'Correo o contraseña incorrectos'
                });
            }

        } else if (expediente) {

            // Si ingresa expediente, buscar estudiante
            perfil = await prisma.perfiles.findUnique({
                where: {
                    matricula: expediente.trim()
                }
            });

            if (!perfil) {
                return res.status(401).json({
                    mensaje: 'Expediente o contraseña incorrectos'
                });
            }

            usuario = await prisma.usuarios.findUnique({
                where: {
                    id_usuario: perfil.id_usuario
                }
            });

            if (!usuario || usuario.rol !== 'estudiante') {
                return res.status(401).json({
                    mensaje: 'Expediente o contraseña incorrectos'
                });
            }

        } else {
            return res.status(400).json({
                mensaje: 'Ingresa tu expediente o correo'
            });
        }

        // Verificar que la cuenta esté activa
        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                mensaje: 'La cuenta no está disponible'
            });
        }

        // Comparar contraseña
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena_hash
        );

        if (!contrasenaCorrecta) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Acceso correcto
        return res.status(200).json({
            exitoso: true,
            mensaje: usuario.rol === 'nutriologa'
                ? '¡Bienvenida a TroyaFit!'
                : '¡Bienvenido a TroyaFit!',

            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                correo: usuario.correo,
                rol: usuario.rol,
                expediente: perfil ? perfil.matricula : null
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        return res.status(500).json({
            mensaje: 'Ocurrió un error al iniciar sesión'
        });
    }
});

module.exports = router;
