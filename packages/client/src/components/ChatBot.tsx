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
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const userId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onCopyMessage = (e: ClipboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", selection);
    }
  };

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setError("");
      setMessages((prev) => [...prev, { message: prompt, role: "user" }]);
      setIsBotTyping(true);
      reset();

      const { data } = await axios.post<ChatResponse>("/api/", {
        prompt,
        userId: userId.current,
      });

      setIsBotTyping(false);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.log("Error when submitting form: ", error);
      setError(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsBotTyping(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-3 mb-8 flex-1 overflow-y-auto">
        {messages.map(({ message, role }, index) => (
          <div
            ref={index === messages.length - 1 ? lastMessageRef : null}
            key={index}
            onCopy={onCopyMessage}
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
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          autoFocus
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
