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
};

const initialState: ModelContextState = {
  models: [],
  model: "",
  setModel: () => null,
};

const ModelContext = createContext<ModelContextState>(initialState);

export const useModelContext = () => useContext(ModelContext);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState("");

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
    }),
    [model, models, setModel],
  );

  console.log("ModelProvider", value);

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
