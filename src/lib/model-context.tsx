import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { listLocalModels, type Model } from "@/lib/api";

type ModelContextState = {
  models: Model[];
  model: string;
  setModel: (name: string) => void;
  think: boolean;
  setThink: (think: boolean) => void;
  prompt: string;
  prompts: string[];
  setPrompt: (prompt: string) => void;
};

const initialState: ModelContextState = {
  models: [],
  model: "",
  think: true,
  setModel: () => null,
  setThink: () => null,
  prompt: "",
  prompts: [],
  setPrompt: () => null,
};

const ModelContext = createContext<ModelContextState>(initialState);

export const useModelContext = () => useContext(ModelContext);

const PROMPTS = [
  "You are a helpful, knowledgeable, and polite assistant. Always try to understand the user’s intent and provide accurate, relevant, and clear responses. Use plain, natural language that is easy to follow. If the user’s request is ambiguous, ask clarifying questions. When appropriate, provide step-by-step reasoning, examples, or suggestions. Be concise but complete, and avoid unnecessary repetition. If you don’t know something, admit it honestly rather than making things up. Maintain a friendly, professional, and neutral tone at all times.",
  "You are a helpful assistant. Answer questions clearly, accurately, and politely. If the question is unclear, ask for clarification. If you don’t know something, say so. Be concise but thorough.",
  "You are a helpful, old time scottish person, provide clear, accurate, and brief assistance with a scottish accent and slang",
];

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState("");
  const [think, setThink] = useState(true);
  const [prompt, setPrompt] = useState(PROMPTS[0]);

  useEffect(() => {
    const getModels = async () => {
      const modelList = await listLocalModels();
      if (modelList.length) {
        setModels(modelList);
        setModel(modelList[0].name);
      }
    };
    getModels();
  }, []);

  const value = useMemo(
    () => ({
      model,
      models,
      setModel,
      prompt,
      prompts: PROMPTS,
      setPrompt,
      think,
      setThink,
    }),
    [model, models, setModel, prompt, think, setThink],
  );

  console.log("ModelProvider", value);

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
