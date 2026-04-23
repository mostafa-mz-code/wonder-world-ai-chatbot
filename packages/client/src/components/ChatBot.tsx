import ReactMarkdown from "react-markdown";
import axios from "axios";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
  role: "assistant" | "user";
};

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const userId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { message: prompt, role: "user" }]);
    setIsBotTyping(true);
    reset();

    const { data } = await axios.post<ChatResponse>("/api/chat", {
      prompt,
      userId: userId.current,
    });

    setIsBotTyping(false);
    setMessages((prev) => [...prev, data]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <div className="flex flex-col gap-3 mb-8">
        {messages.map(({ message, role }, index) => (
          <div
            key={index}
            className={`p-4 rounded-3xl max-w-4/5 ${role === "user" ? "bg-[#79dbff] text-white self-end" : "bg-[#f7f7f7] text-black self-start"}`}
          >
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex  gap-1 bg-gray-200 p-3 rounded-full self-start">
            <div className="size-2 rounded-full bg-black animate-pulse"></div>
            <div className="size-2 rounded-full bg-black animate-pulse"></div>
            <div className="size-2 rounded-full bg-black animate-pulse"></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        ref={formRef}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register("prompt", {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          className="w-full border-none focus:outline-none resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full size-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
