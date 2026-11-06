
const express = require('express');
const cors = require('cors');
const prisma = require('./db');

const app = express();
const PORT = 3000;
const registroRoutes = require('./routes/registro');
const loginRoutes = require('./routes/login');
const disponibilidadRoutes = require('./routes/disponibilidad');
const citasRoutes = require('./routes/citas');
const planesRoutes = require('./routes/planes');
const medicionesRoutes = require('./routes/mediciones');
const consultasRoutes = require('./routes/consultas');
// Configuración del servidor
app.use(cors());
app.use(express.json());
app.use('/api/registro', registroRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/mediciones', medicionesRoutes);
app.use('/api/consultas', consultasRoutes);


// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de TroyaFit funcionando correctamente'
    });
});

// Comprobar conexión con MySQL
app.get('/api/estado-db', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            conectado: true,
            mensaje: 'Conexión con MySQL exitosa'
        });
    } catch (error) {
        console.error('Error de conexión:', error);

        res.status(500).json({
            conectado: false,
            mensaje: 'No se pudo conectar con la base de datos'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Cerrar correctamente la conexión
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
