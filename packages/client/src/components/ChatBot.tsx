import axios from "axios";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRef, useState, type KeyboardEvent } from "react";

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: { message: string };
};

const ChatBot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const userId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, prompt]);
    reset();

    const { data } = await axios.post<ChatResponse>("/api/chat", {
      prompt,
      userId: userId.current,
    });

    setMessages((prev) => [...prev, data.message.message]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
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
