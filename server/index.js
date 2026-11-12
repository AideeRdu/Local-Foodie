
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";


dotenv.config();

// connect to neon
const sql = neon(process.env.DATABASE_URL);

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

// Retrive number of cafe visits

app.get("/api/visits", async (req, res) => {
  try {
    const { businessId, visitorId } = req.query;

    if (!businessId || !visitorId) {
      return res.status(400).json({ error: "Missing information" });
    }

    const result = await sql`
      SELECT
        COUNT(*)::int AS count,
        EXISTS (
        SELECT 1
        FROM business_visits
        WHERE business_id = ${businessId}
        AND visitor_id = ${visitorId}
        ) AS visited_before
      FROM business_visits
      WHERE business_id = ${businessId}
    `;

    res.json({
    count: result[0].count,
    visitedBefore: result[0].visited_before
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not get visit count" });
  }
});


// Record a visit
app.post("/api/visits", async (req, res) => {
  try {
    const { businessId, visitorId } = req.body;

    if (!businessId || !visitorId) {
      return res.status(400).json({ error: "Missing information" });
    }

    const inserted = await sql`
      INSERT INTO business_visits (business_id, visitor_id)
      VALUES (${businessId}, ${visitorId})
      ON CONFLICT (business_id, visitor_id)
      DO NOTHING
      RETURNING id
    `;

    const result = await sql`
      SELECT COUNT(*)::int AS count
      FROM business_visits
      WHERE business_id = ${businessId}
    `;

    res.json({
      count: result[0].count,
      recorded: inserted.length > 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not record visit" });
  }
});