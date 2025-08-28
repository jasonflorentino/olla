import React, { createContext, useContext, useMemo, useState } from "react";
import type { Message } from "./api";

type ChatContextState = {
  message: string;
  setMessage: (message: string) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
};

const initialState: ChatContextState = {
  message: "",
  setMessage: () => null,
  messages: [],
  setMessages: () => null,
};

const ChatContext = createContext<ChatContextState>(initialState);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const value = useMemo(
    () => ({
      message,
      setMessage,
      messages,
      setMessages,
    }),
    [message, setMessage, messages, setMessages],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
