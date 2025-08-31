import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Message, ChatCompletionChunk } from "./types";
import { djb2, getMessageMeta } from "./util";

type ChatContextState = {
  message: string;
  setMessage: (message: string) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  updateResponse: (chunk: ChatCompletionChunk) => void;
};

const initialState: ChatContextState = {
  message: "",
  setMessage: () => null,
  messages: [],
  setMessages: () => null,
  updateResponse: () => null,
};

const ChatContext = createContext<ChatContextState>(initialState);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const updateResponse = useCallback(
    (c: ChatCompletionChunk) => {
      setMessages((msgs) => {
        const text = c.message.content;
        const lastResponse = msgs[msgs.length - 1];
        const meta = c.done ? getMessageMeta(c) : undefined;
        // keep replacing the assistant's most recent reponse
        if (lastResponse.role === "assistant") {
          return [
            ...msgs.slice(0, msgs.length - 1),
            {
              role: "assistant",
              content: lastResponse.content + text,
              key: djb2(lastResponse.content + text),
              meta,
            },
          ];
        } else {
          return [
            ...msgs,
            { role: "assistant", content: text, key: djb2(text), meta },
          ];
        }
      });
    },
    [setMessages],
  );

  const value = useMemo(
    () => ({
      message,
      setMessage,
      messages,
      setMessages,
      updateResponse,
    }),
    [message, setMessage, messages, setMessages, updateResponse],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
