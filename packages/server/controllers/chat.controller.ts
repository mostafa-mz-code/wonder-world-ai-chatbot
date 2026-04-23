import z from "zod";
import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";

// Implementation detail
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  userId: z.string().uuid(),
});

// Public controller
export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      const cleanError = z.treeifyError(parseResult.error);
      return res.status(400).json({ error: cleanError });
    }
    try {
      const { prompt, userId = "default-user" } = parseResult.data;

      const assistantMessage = await chatService.sendMessage(prompt, userId);

      return res.json({ message: assistantMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  },
};
