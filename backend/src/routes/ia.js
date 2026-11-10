const express = require('express');
const router = express.Router();
const prisma = require('../db');
// Generar una propuesta de menú con Azure AI
router.post('/generar-menu', async (req, res) => {
    try {
        const {
            caloriasObjetivo,
            dias = 5,
            preferencias = '',
            restricciones = '',
            indicaciones = ''
        } = req.body;
        if (!caloriasObjetivo || Number(caloriasObjetivo) <= 0) {
            return res.status(400).json({
                mensaje: 'Ingresa un objetivo de calorías válido.'
            });
        }
        if (!Number.isInteger(Number(dias)) || Number(dias) < 1 || Number(dias) > 7) {
            return res.status(400).json({
                mensaje: 'Los días deben ser un número entre 1 y 7.'
            });
        }
            // Consultar los alimentos disponibles en el catálogo
const alimentosCatalogo = await prisma.alimentos.findMany({
    where: {
        activo: true
    },
    select: {
        id_alimento: true,
        nombre: true,
        unidad_base: true,
        calorias: true
    }
});
console.log('ALIMENTOS DEL CATÁLOGO:', alimentosCatalogo);
        const prompt = `
Eres un asistente de apoyo para la nutrióloga de TroyaFit.

Tu tarea es elaborar un BORRADOR de menú alimenticio
para que una profesional de nutrición lo revise y ajuste.

Datos proporcionados:
- Calorías objetivo: ${caloriasObjetivo}
- Número de días: ${dias}
- Preferencias alimenticias: ${preferencias || 'No especificadas'}
- Restricciones alimenticias: ${restricciones || 'No especificadas'}
- Indicaciones adicionales: ${indicaciones || 'Ninguna'}
Catálogo de alimentos disponibles en TroyaFit:
${JSON.stringify(alimentosCatalogo.map(alimento => ({
    id: alimento.id_alimento,
    nombre: alimento.nombre,
    unidad: alimento.unidad_base
})), null, 2)}

Reglas para utilizar el catálogo:
- Prioriza los alimentos que aparecen en el catálogo.
- Respeta el nombre y la unidad base de cada alimento.
- Puedes proponer alimentos que no estén en el catálogo si son necesarios.
- No inventes identificadores de alimentos.
- No cambies alimentos cocidos por crudos ni viceversa.
Instrucciones:
1. Organiza cada día en desayuno, comida, cena y colaciones.
2. Incluye nombre del platillo e ingredientes.
3. Propón cantidades y unidades orientativas.
4. Considera las preferencias y restricciones indicadas.
5. No presentes el menú como una prescripción médica.
6. No inventes alergias, diagnósticos ni datos del estudiante.
7. Indica que las cantidades y el aporte nutricional deben
   ser revisados por la nutrióloga antes de publicarse.

Responde exclusivamente con JSON válido, sin Markdown,
con esta estructura:

{
  "dias": [
    {
      "dia": 1,
      "comidas": [
        {
          "tipo": "desayuno",
          "nombre": "Nombre del platillo",
          "instrucciones": "Preparación del platillo",
          "ingredientes": [
            {
              "nombre": "Nombre del alimento",
              "cantidad": 1,
              "unidad": "pieza"
            }
          ]
        }
      ]
    }
  ],
  "observaciones": "Propuesta pendiente de revisión profesional."
}
`;
        const { preguntarAzure } = require('../azure');
        const respuesta = await preguntarAzure(prompt);
        console.log('MENÚ GENERADO POR AZURE:', respuesta);
        // Clasificar ingredientes según el catálogo de TroyaFit
const normalizar = (texto) =>
    texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

const equivalencias = {
    'huevos': 'huevo',
    'espinacas': 'espinaca',
    'espinacas frescas': 'espinaca',
    'tomate': 'jitomate',
    'jitomate (tomate)': 'jitomate',
    'naranja fresca': 'naranja',
    'pan integral (rebanada)': 'pan integral',
    'pechuga de pollo': 'pechuga de pollo cocida',
    'garbanzos cocidos': 'garbanzo cocido',
    'atun en agua (escurrido)': 'atun en agua',
    'platano (banano) mediano': 'platano',
    'zanahoria (en palitos)': 'zanahoria'
};

const clasificarIngrediente = (ingrediente) => {
    const nombreBuscado = normalizar(ingrediente.nombre);

    const nombreEquivalente = equivalencias[nombreBuscado]
        || nombreBuscado;

    const alimentoEncontrado = alimentosCatalogo.find(
        alimento => normalizar(alimento.nombre) === nombreEquivalente
    );

    return {
        ...ingrediente,
        id_alimento: alimentoEncontrado
            ? alimentoEncontrado.id_alimento
            : null,
        en_catalogo: Boolean(alimentoEncontrado),
        estado: alimentoEncontrado
            ? 'disponible'
            : 'pendiente_catalogo'
    };
};

        let propuesta;

        try {
            propuesta = JSON.parse(respuesta);
        } catch (error) {
            console.error('Respuesta de Azure no válida:', respuesta);

            return res.status(500).json({
                mensaje: 'La IA no generó una respuesta con formato válido. Intenta nuevamente.'
            });
        }

       // Clasificar todos los ingredientes de la propuesta
propuesta.dias = propuesta.dias.map(dia => ({
    ...dia,
    comidas: dia.comidas.map(comida => ({
        ...comida,
        ingredientes: comida.ingredientes.map(ingrediente =>
            clasificarIngrediente(ingrediente)
        )
    }))
}));

res.json({
    generado: true,
    mensaje: 'Propuesta de menú generada correctamente.',
    propuesta
});

    } catch (error) {
        console.error('Error al generar menú:', error);

        res.status(500).json({
            generado: false,
            mensaje: 'No se pudo generar la propuesta de menú.',
            detalle: error.message
        });
    }
});

module.exports = router;
