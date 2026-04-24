import type { ClipboardEvent } from "react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export type ChatResponse = {
  message: string;
  role: "assistant" | "user";
};

type Props = {
  messages: ChatResponse[];
};
const ChatMessages = ({ messages }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const onCopyMessage = (e: ClipboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", selection);
    }
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3 ">
      {messages.map(({ message, role }, index) => (
        <div
          ref={index === messages.length - 1 ? lastMessageRef : null}
          key={index}
          onCopy={onCopyMessage}
          className={`px-4 py-2 rounded-3xl max-w-4/5 ${role === "user" ? "bg-[#79dbff] text-white self-end" : "bg-[#f7f7f7] text-black self-start"}`}
        >
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
