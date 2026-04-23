import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import ollama from "ollama";
import z from "zod";
import { conversationRepository } from "./repositories/conversation.repository";

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
// Store history in a Map keyed by a unique session ID
// const chatHistories = new Map<string, { role: string; content: string }[]>();

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  conversationId: z.string().uuid(),
});
app.post("/api/chat", async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  if (!parseResult.success) {
    const cleanError = z.treeifyError(parseResult.error);
    return res.status(400).json({ error: cleanError });
  }
  try {
    const { prompt, sessionId = "default-user" } = req.body;

    // 1. Get or create history for this user session
    // if (!chatHistories.has(sessionId)) {
    //   chatHistories.set(sessionId, [
    //     { role: "system", content: "You are a helpful AI assistant." },
    //   ]);
    // }
    // const history = chatHistories.get(sessionId)!;
    const history = conversationRepository.getOrCreate(sessionId);

    // 2. Add the NEW user message to the history
    // history.push({ role: "user", content: prompt });
    conversationRepository.addMessage(history, prompt);

    // 3. Send the FULL history to Ollama
    const response = await ollama.chat({
      model: "llama3.2",
      messages: history,
      stream: false,
    });

    // 4. Add the model's response to the history for next time
    const assistantMessage = response.message;
    // history.push(assistantMessage);
    conversationRepository.addMessage(history, assistantMessage.content);

    // 5. Return only the latest reply to the client
    return res.json({ message: assistantMessage.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
