import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Usa el nombre GOOGLE_API_KEY de Vercel.
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
    }

    try {
        const { base64Image, medicalHistory } = req.body;

        if (!base64Image) {
            return res.status(400).json({ error: "Imagen base64 no proporcionada." });
        }

        const fullPrompt = `Genera un informe colposcópico técnico y conciso basado en la siguiente imagen. Considera la Unión Escamocolumnar, la Zona de Transformación y el Exocérvix. Integra el historial médico del paciente si es relevante: "${medicalHistory}". El informe debe ser profesional, estructurado en secciones y estar en español. Evita frases introductorias o conversacionales. Utiliza el siguiente formato exacto para las secciones y viñetas:\n\nObservaciones Principales:\n- [Observación 1]\n- [Observación 2]\n\nPosible Diagnóstico:\n- [Diagnóstico 1]\n\nRecomendaciones:\n- [Recomendación 1]\n- [Recomendación 2]`;

        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: fullPrompt },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }
            ],
        };
        
        const response = await ai.models.generateContent(payload);

        if (!response.text) {
             throw new Error("La API no devolvió una respuesta de texto válida o la solicitud fue bloqueada.");
        }

        res.status(200).json({ 
            response: response.text 
        });

    } catch (error) {
        console.error("Error al llamar a la API:", error);
        res.status(500).json({ error: `Fallo del Servidor: ${error.message}` });
    }
}
