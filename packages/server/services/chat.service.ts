import { conversationRepository } from "../repositories/conversation.repository";
import ollama from "ollama";

type Message = {
  message: string;
  role: string;
};

export const chatService = {
  async sendMessage(prompt: string, sessionId: string): Promise<Message> {
    const history = conversationRepository.getOrCreate(sessionId);

    conversationRepository.addMessage(history, prompt);
    try {
      const response = await ollama.chat({
        model: "llama3.2",
        messages: history,
        stream: false,
      });
      const assistantMessage = response.message;
      conversationRepository.addMessage(history, assistantMessage.content);

      return { message: assistantMessage.content, role: assistantMessage.role };
    } catch (error) {
      throw new Error("Failed to fetch AI response");
    }
  },
};
