
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

// AI search route
app.post("/api/search", async (req, res) => {
    try {
        const userQuery = req.body.query;

        if (!userQuery) {
            return res.status(400).json({
                error: "Search query is required"
            });
        }

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: `Extract restaurant search preferences.
                    Return JSON with these fields:
                    cuisine, price, openLate, groupFriendly,
                    atmosphere, wifi.
                    Use null for unknown preferences.
                    Return only valid JSON.`
                },
                {
                    role: "user",
                    content: userQuery
                }
            ],
            reasoning_effort: "low",
            max_completion_tokens: 200,
            response_format: {
                type: "json_object"
            }
        });

        const result = response.choices[0].message.content;

        const preferences = JSON.parse(result);

        res.json(preferences);

    } catch (error) {
        console.error("Groq API error:", error);
        res.status(500).json({
            error: "AI search failed",
            details: error.message
        });
    }
});

// Start server
app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});
