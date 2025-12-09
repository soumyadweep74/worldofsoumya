const { GoogleGenAI } = require('@google/genai');

// Make sure the API key is accessible in Netlify Environment Variables
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    // Return a 500 error if the key is missing to trigger the client-side error
    exports.handler = async (event) => {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API Key not set' }),
        };
    };
    return;
}

// Initialize the SDK using the environment variable key
const ai = new GoogleGenAI({ apiKey: API_KEY });

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const body = JSON.parse(event.body);
        const image = body.image; // This comes from your client-side main.js

        if (!image || !image.data || !image.mimeType) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing image data' }) };
        }

        // Construct the parts array for the vision model
        const imagePart = {
            inlineData: {
                data: image.data,
                mimeType: image.mimeType,
            },
        };

        const promptPart = {
            text: "Describe this image in a single, detailed sentence.",
        };

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
            body: JSON.stringify({ error: 'Internal Server Error during AI processing: ' + error.message }),
        };
    }
};
