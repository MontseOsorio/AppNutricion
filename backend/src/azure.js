
const OpenAI = require("openai");
const dotenv = require("dotenv");
const path = require("path");

// Cargar las variables del archivo .env
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// Verificar que existan las credenciales
if (!process.env.AZURE_OPENAI_ENDPOINT ||
    !process.env.AZURE_OPENAI_API_KEY ||
    !process.env.AZURE_OPENAI_DEPLOYMENT) {
    throw new Error("Faltan las variables de configuración de Azure en .env");
}

// Crear el cliente de Azuref
const client = new OpenAI({
    baseURL: process.env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, ""),
    apiKey: process.env.AZURE_OPENAI_API_KEY
});

// Función para enviar mensajes a GPT-5-mini
async function preguntarAzure(mensaje) {
    const response = await client.responses.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT,
        input: mensaje
    });

    return response.output_text;
}

module.exports = {
    client,
    preguntarAzure
};
