import axios from "axios";
import { useRef, useState } from "react";
import ChatInput, { type ChatFormData } from "./ChatInput";
import ChatMessages, { type ChatResponse } from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import popSound from "@/assets/sounds/pop.wav";
import notificationSound from "@/assets/sounds/notification.wav";

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

const ChatBot = () => {
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const userId = useRef(crypto.randomUUID());

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setError("");
      setMessages((prev) => [...prev, { message: prompt, role: "user" }]);
      setIsBotTyping(true);
      popAudio.play();

      const { data } = await axios.post<ChatResponse>("/api/chat", {
        prompt,
        userId: userId.current,
      });

      setIsBotTyping(false);
      setMessages((prev) => [...prev, data]);
      notificationAudio.play();
    } catch (error) {
      console.log("Error when submitting form: ", error);
      setError(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-3/5">
      <div className="flex flex-col gap-3 mb-8 flex-1 overflow-y-auto">
        <ChatMessages messages={messages} />

        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatBot;
