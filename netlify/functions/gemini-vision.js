const { GoogleGenAI } = require('@google/genai');
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    exports.handler = async () => ({
        statusCode: 500,
        body: JSON.stringify({ error: 'API Key not set' })
    });
    return;
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const image = body.image;

        if (!image || !image.data || !image.mimeType) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing image data' }) };
        }

        const modelResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { inlineData: { data: image.data, mimeType: image.mimeType } },
                { text: "Describe this image in a single, detailed sentence." }
            ]
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: modelResponse.text.trim() })
        };

    } catch (error) {
        console.error('Gemini Function Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message })
        };
    }
};
