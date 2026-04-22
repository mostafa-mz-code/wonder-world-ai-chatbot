import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import ollama from "ollama";

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(`Hello World, my api_key ${process.env.OPENAI_API_KEY}`);
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: `Hello World` });
});

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const response = await ollama.chat({
      model: "llama3.2",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });
    return res.json({ message: response.message.content });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
