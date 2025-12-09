import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, res) => {
    try {
        const { image, prompt } = JSON.parse(req.body);

        // Load API key from Netlify environment variable
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/png",
                                data: image
                            }
                        }
                    ]
                }
            ]
        });

        const text = result.response.text();

        // Split output: 1st line = description, rest = labels
        const [firstLine, ...otherLines] = text.split("\n");

        res.status(200).json({
            description: firstLine,
            labels: otherLines.filter(line => line.trim() !== "")
        });

    } catch (error) {
        console.error("Function Error:", error);
        res.status(500).json({ error: "Gemini Vision function failed." });
    }
};
