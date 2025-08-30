import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  showModelInformation,
  listLocalModels,
  type Model,
  type ModelInformation,
} from "@/lib/api";

type ModelContextState = {
  models: Model[];
  model: string;
  setModel: (name: string) => void;
  think: boolean;
  setThink: (think: boolean) => void;
  canThink: boolean;
  prompt: string;
  prompts: string[];
  setPrompt: (prompt: string) => void;
  modelInformation: Record<string, ModelInformation>;
};

const initialState: ModelContextState = {
  models: [],
  model: "",
  setModel: () => null,
  think: true,
  setThink: () => null,
  canThink: false,
  prompt: "",
  prompts: [],
  setPrompt: () => null,
  modelInformation: {},
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
  const [think, setThink] = useState(false);
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [modelInformation, setModelInformation] = useState<
    ModelContextState["modelInformation"]
  >({});

  const modelInfoTriesRef = useRef<Map<string, number>>(new Map());

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

  useEffect(() => {
    if (!model) {
      return;
    }
    if (modelInformation[model]) {
      return;
    }

    const tries = modelInfoTriesRef.current;
    const curr = tries.get(model);

    if (curr === undefined) {
      tries.set(model, 1);
    } else if (curr > 5) {
      console.warn("retry limit reached");
      return;
    } else {
      tries.set(model, curr + 1);
    }

    showModelInformation({
      model_name: model,
    })
      .then((modelInfo) => {
        console.log({ model, modelInfo });
        if (!modelInfo) {
          return;
        }
        setModelInformation((prev) => {
          return { ...prev, [model]: modelInfo };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [model, modelInformation, setModelInformation]);

  const value = useMemo(
    () => ({
      model,
      models,
      setModel,
      modelInformation,
      prompt,
      prompts: PROMPTS,
      setPrompt,
      think,
      setThink,
      canThink: modelInformation[model]?.capabilities.some(
        (c) => c === "thinking",
      ),
    }),
    [model, models, modelInformation, setModel, prompt, think, setThink],
  );

  useEffect(() => {
    if (!value.canThink && think) {
      setThink(false);
    }
  }, [value.canThink, think]);

  console.log("ModelProvider", value);

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
