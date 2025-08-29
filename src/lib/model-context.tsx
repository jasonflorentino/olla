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
};

const initialState: ModelContextState = {
  models: [],
  model: "",
  think: true,
  setModel: () => null,
  setThink: () => null,
};

const ModelContext = createContext<ModelContextState>(initialState);

export const useModelContext = () => useContext(ModelContext);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState("");
  const [think, setThink] = useState(true);

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
      think,
      setThink,
    }),
    [model, models, setModel, think, setThink],
  );

  console.log("ModelProvider", value);

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
