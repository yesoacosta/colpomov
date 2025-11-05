import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel y Node.js leerán la clave API de forma SEGURA aquí.
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Esta función maneja la solicitud que viene desde tu navegador.
export default async function handler(req, res) {
    // Solo manejamos solicitudes POST (para enviar datos de chat)
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
    }

    try {
        // Obtenemos el texto del usuario desde el cuerpo de la solicitud
        const userPrompt = req.body.prompt;
        
        // Llamada a la API de Google Gemini (esto es lo que antes fallaba)
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Puedes cambiar el modelo si usas otro
            contents: userPrompt
        });

        // Enviamos el resultado (el texto de respuesta de la IA) al navegador
        res.status(200).json({ 
            response: response.text 
        });

    } catch (error) {
        console.error("Error al llamar a la API:", error);
        res.status(500).json({ error: "Hubo un error al generar la respuesta." });
    }
}
