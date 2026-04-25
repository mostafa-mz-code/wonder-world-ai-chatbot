import fs from "fs";
import ollama from "ollama";
import path from "path";
import template from "../prompts/chatbot.txt";
import { conversationRepository } from "../repositories/conversation.repository";

const parkInfo = fs.readFileSync(
  path.join(__dirname, "..", "prompts", "WonderWorld.md"),
  "utf-8"
);

const instructions = template.replace("{{parkInfo}}", parkInfo);
export const chatService = {
  async sendMessage(prompt: string, userId: string) {
    // 1. Save user message

    conversationRepository.addMessage(userId, {
      role: "user",
      content: prompt,
    });

    // 2. get updated history
    const history = conversationRepository.getHistory(userId);

    try {
      // 3. send to ollama
      const response = await ollama.chat({
        model: "llama3.2",
        messages: [
          {
            role: "system",
            content: instructions,
          },
          ...history,
        ],
      });

      const assistantMessage = response.message;

      // 4. save assistant response
      conversationRepository.addMessage(userId, {
        role: "assistant",
        content: assistantMessage.content,
      });

      return { message: assistantMessage.content, role: assistantMessage.role };
    } catch (error) {
      throw new Error("Failed to fetch AI response");
    }
  },
};
