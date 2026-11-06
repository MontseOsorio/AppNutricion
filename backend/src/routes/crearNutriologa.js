
const prisma = require('../db');
const bcrypt = require('bcryptjs');
const readline = require('readline/promises');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function crearNutriologa() {
    try {
        const correo = 'nutriologa@troyafit.local';

        const existente = await prisma.usuarios.findUnique({
            where: { correo }
        });

        if (existente) {
            console.log('La cuenta ya existe.');
            return;
        }

        const contrasena = await rl.question(
            'Escribe la contraseña para la nutrióloga: '
        );

        if (contrasena.length < 8) {
            console.log('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        const hash = await bcrypt.hash(contrasena, 10);

        const usuario = await prisma.usuarios.create({
            data: {
                nombre: 'Elián Gabriela',
                apellidos: 'Berra González',
                correo,
                contrasena_hash: hash,
                rol: 'nutriologa',
                activo: true
            }
        });

        console.log('¡Cuenta creada correctamente!');
        console.log('ID:', usuario.id_usuario);
        console.log('Correo:', usuario.correo);
        console.log('Rol:', usuario.rol);

    } catch (error) {
        console.error('Error al crear la cuenta:', error);
    } finally {
        rl.close();
        await prisma.$disconnect();
    }
}

crearNutriologa();
