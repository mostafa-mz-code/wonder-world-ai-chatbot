import { conversationRepository } from "../repositories/conversation.repository";
import ollama from "ollama";

export const chatService = {
  async sendMessage(prompt: string, userId: string) {
    // 1. Save user message

    conversationRepository.addMessage(userId, {
      role: "user",
      content: prompt,
    });

    // 2. get updated history
    const history = conversationRepository.getHistory(userId);
    console.log("====================================");
    console.log(history);
    console.log("====================================");
    try {
      // 3. send to ollama
      const response = await ollama.chat({
        model: "llama3.2",
        messages: history,
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
