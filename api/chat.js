import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 ¡CORRECCIÓN AQUÍ! Usa el nombre GOOGLE_API_KEY que tienes en Vercel.
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Esta función maneja la solicitud que viene desde tu navegador.
export default async function handler(req, res) {
    // Solo manejamos solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
    }

    try {
        // Obtenemos el texto del usuario desde el cuerpo de la solicitud
        const userPrompt = req.body.prompt;
        
        // Configuración para el modelo (puedes ajustar esto)
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Modelo recomendado
            contents: userPrompt
        });

        // Enviamos la respuesta de la IA de vuelta a tu página web
        res.status(200).json({ 
            response: response.text 
        });

    } catch (error) {
        // En caso de que falle la API (por ejemplo, si el token expiró, etc.)
        console.error("Error al llamar a la API de Google:", error);
        res.status(500).json({ error: "Hubo un error al generar la respuesta. Revisa los logs de Vercel para detalles." });
    }
}
