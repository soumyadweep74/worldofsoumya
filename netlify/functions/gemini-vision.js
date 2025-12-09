// netlify/functions/gemini-vision.js
const { GoogleGenAI } = require('@google/genai');

// Make sure the API key is set in Netlify Environment Variables
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    exports.handler = async () => {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API Key not set in environment variables' }),
        };
    };
    return;
}

// Initialize Google Gemini SDK
const ai = new GoogleGenAI({ apiKey: API_KEY });

exports.handler = async (event) => {
    try {
        // Only allow POST requests
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: 'Method Not Allowed',
            };
        }

        // Parse JSON body
        const body = JSON.parse(event.body);
        const image = body.image;

        if (!image || !image.data || !image.mimeType) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing image data or mimeType' }),
            };
        }

        // Prepare input for Gemini
        const imagePart = {
            inlineData: {
                data: image.data,
                mimeType: image.mimeType,
            },
        };

        const promptPart = {
            text: "Describe this image in a single, detailed sentence.",
        };

        // Generate AI content
        const modelResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [imagePart, promptPart],
        });

        const description = modelResponse.text.trim();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description }),
        };
    } catch (error) {
        console.error('Gemini Function Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message }),
        };
    }
};
