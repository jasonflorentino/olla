import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Message, type ChatCompletionChunk, Role } from "./types";
import { djb2, getMessageMeta } from "./util";
import * as Hooks from "@/lib/hooks";
import { Logger } from "@/lib/log";

type ChatContextState = {
  message: string;
  setMessage: (message: string) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setSummary: (summary: string) => void;
  setSummaryEnabled: (enabled: boolean) => void;
  updateResponse: (chunk: ChatCompletionChunk) => void;
  summary: string;
  summaryEnabled: boolean;
};

const logger = new Logger("ChatContext");

const initialState: ChatContextState = {
  message: "",
  setMessage: () => null,
  messages: [],
  setMessages: () => null,
  setSummary: () => null,
  setSummaryEnabled: () => null,
  updateResponse: () => null,
  summary: "",
  summaryEnabled: true,
};

const ChatContext = createContext<ChatContextState>(initialState);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState("");
  const [summaryEnabled, setSummaryEnabled] = Hooks.useLocalStorage(
    "summaryEnabled",
    true,
  );

  useEffect(() => {
    logger.debug("summary:", summary);
  }, [summary]);

  const updateResponse = useCallback(
    (c: ChatCompletionChunk) => {
      setMessages((msgs) => {
        const text = c.message.content;
        const lastResponse = msgs[msgs.length - 1];
        const meta = getMessageMeta(c);
        // keep replacing the assistant's most recent reponse
        if (lastResponse.role === Role.Assistant) {
          return [
            ...msgs.slice(0, msgs.length - 1),
            {
              role: Role.Assistant,
              content: lastResponse.content + text,
              key: djb2(lastResponse.content + text),
              meta,
            },
          ];
        } else {
          return [
            ...msgs,
            { role: Role.Assistant, content: text, key: djb2(text), meta },
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
      setSummary,
      setSummaryEnabled,
      messages,
      setMessages,
      summary,
      summaryEnabled,
      updateResponse,
    }),
    [
      message,
      setMessage,
      setSummary,
      setSummaryEnabled,
      messages,
      summary,
      setMessages,
      summaryEnabled,
      updateResponse,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
