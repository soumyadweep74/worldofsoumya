const fetch = require("node-fetch");

exports.handler = async (event, context) => {
    try {
        const body = JSON.parse(event.body);

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API Key missing" })
            };
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: body.prompt },
                            { inline_data: { mime_type: "image/jpeg", data: body.image } }
                        ]
                    }]
                })
            }
        );

        const data = await response.json();

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

        const lines = aiText.split("\n").filter(l => l.trim() !== "");

        return {
            statusCode: 200,
            body: JSON.stringify({
                description: lines[0],
                labels: lines.slice(1)
            })
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
