import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Configuración de la IA
//    Usa la variable de entorno de Vercel (GOOGLE_API_KEY)
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
    }

    try {
        // 2. Obtener los datos del frontend
        const { base64Image, medicalHistory } = req.body;

        if (!base64Image) {
            return res.status(400).json({ error: "Imagen base64 no proporcionada." });
        }

        // 3. Seleccionar el modelo correcto para visión
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 4. Construir el prompt y las partes
        const prompt = `Genera un informe colposcópico técnico y conciso basado en la siguiente imagen. Considera la Unión Escamocolumnar, la Zona de Transformación y el Exocérvix. Integra el historial médico del paciente si es relevante: "${medicalHistory}". El informe debe ser profesional, estructurado en secciones y estar en español. Evita frases introductorias o conversacionales. Utiliza el siguiente formato exacto para las secciones y viñetas:\n\nObservaciones Principales:\n- [Observación 1]\n- [Observación 2]\n\nPosible Diagnóstico:\n- [Diagnóstico 1]\n\nRecomendaciones:\n- [Recomendación 1]\n- [Recomendación 2]`;

        const imageParts = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                }
            }
        ];

        // 5. Llamar a la IA de la forma correcta
        const result = await model.generateContent([prompt, ...imageParts]);

        // 6. Obtener la respuesta de texto
        const response = result.response;
        const textDelInforme = response.text();

        if (!textDelInforme) {
            throw new Error("La API no devolvió una respuesta de texto válida.");
        }

        // 7. Enviar la respuesta al frontend
        res.status(200).json({
            response: textDelInforme
        });

    } catch (error) {
        console.error("Error al llamar a la API:", error);
        res.status(500).json({ error: `Fallo del Servidor: ${error.message}` });
    }
}
