import React from "react";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";

const ChatBot = () => {
  return (
    <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
      <textarea
        className="w-full border-none focus:outline-none resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button className="rounded-full size-9">
        <FaArrowUp />
      </Button>
    </div>
  );
};

export default ChatBot;
