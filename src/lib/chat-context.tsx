import React, { createContext, useContext, useMemo, useState } from "react";

type ChatContextState = {
  message: string;
  setMessage: (message: string) => void;
};

const initialState: ChatContextState = {
  message: "",
  setMessage: () => null,
};

const ChatContext = createContext<ChatContextState>(initialState);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("")

  const value = useMemo(() => ({
    message,setMessage
  }), [message, setMessage])

  return (
    <ChatContext.Provider value={value}>
      { children }
    </ChatContext.Provider>
  )
}
