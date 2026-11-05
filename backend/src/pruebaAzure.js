
const { preguntarAzure } = require("./azure");

async function probarConexion() {
    try {
        console.log("Conectando con Azure GPT-5-mini...");

        const respuesta = await preguntarAzure(
            "Hola, soy TroyaFit. Preséntate brevemente en español."
        );

        console.log("\nRespuesta de GPT-5-mini:");
        console.log(respuesta);

        console.log("\n¡Conexión exitosa con Azure!");
    } catch (error) {
        console.error("\nError al conectar con Azure:");

        console.error(error.message);
    }
}

probarConexion();
