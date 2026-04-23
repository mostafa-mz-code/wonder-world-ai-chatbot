import axios from "axios";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRef, type KeyboardEvent } from "react";

type FormData = {
  prompt: string;
};

const ChatBot = () => {
  const userId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    reset();

    const { data } = await axios.post("/api/chat", {
      prompt,
      userId: userId.current,
    });

    console.log("====================================");
    console.log(data);
    console.log("====================================");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
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
  );
};

export default ChatBot;
