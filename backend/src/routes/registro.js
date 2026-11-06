
const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db');

const router = express.Router();

// Registrar estudiante
router.post('/', async (req, res) => {
    try {
        const {
            nombreCompleto,
            expediente,
            correo,
            contrasena,
            confirmarContrasena
        } = req.body;

        // Validar campos vacíos
        if (
            !nombreCompleto ||
            !expediente ||
            !correo ||
            !contrasena ||
            !confirmarContrasena
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Validar que las contraseñas coincidan
        if (contrasena !== confirmarContrasena) {
            return res.status(400).json({
                mensaje: 'Las contraseñas no coinciden'
            });
        }

        // Validar correo
        const correoLimpio = correo.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
            return res.status(400).json({
                mensaje: 'Ingresa un correo electrónico válido'
            });
        }

        // Validar contraseña
        if (contrasena.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        // Separar nombre y apellidos
        const partesNombre = nombreCompleto.trim().split(/\s+/);

        if (partesNombre.length < 2) {
            return res.status(400).json({
                mensaje: 'Escribe tu nombre y al menos un apellido'
            });
        }

        const nombre = partesNombre.shift();
        const apellidos = partesNombre.join(' ');

        const matricula = expediente.trim();

        // Comprobar si el correo ya existe
        const usuarioExistente = await prisma.usuarios.findUnique({
            where: {
                correo: correoLimpio
            }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'Este correo ya está registrado'
            });
        }

        // Comprobar si el expediente ya existe
        const perfilExistente = await prisma.perfiles.findUnique({
            where: {
                matricula: matricula
            }
        });

        if (perfilExistente) {
            return res.status(409).json({
                mensaje: 'Este expediente ya está registrado'
            });
        }

        // Proteger contraseña
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        // Crear usuario y perfil en una transacción
        const nuevoUsuario = await prisma.$transaction(async (tx) => {

            const usuario = await tx.usuarios.create({
                data: {
                    nombre,
                    apellidos,
                    correo: correoLimpio,
                    contrasena_hash: contrasenaHash,
                    rol: 'estudiante'
                }
            });

            await tx.perfiles.create({
                data: {
                    id_usuario: usuario.id_usuario,
                    matricula
                }
            });

            return usuario;
        });

        return res.status(201).json({
            exitoso: true,
            mensaje: '¡Tu cuenta de TroyaFit fue creada correctamente!',
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                nombre: nuevoUsuario.nombre,
                apellidos: nuevoUsuario.apellidos,
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                mensaje: 'El correo o expediente ya están registrados'
            });
        }

        return res.status(500).json({
            mensaje: 'Ocurrió un error al crear la cuenta'
        });
    }
});

module.exports = router;
