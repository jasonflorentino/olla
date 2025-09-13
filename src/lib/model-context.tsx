import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { API, Hooks } from "@/lib";
import { type Model, type ModelInformation } from "@/lib/types";
import { toast } from "sonner";
import { Logger } from "./log";
import { PROMPTS } from "./prompts";

type ModelContextState = {
  models: Model[];
  model: string;
  setModel: (name: string) => void;
  think: boolean;
  setThink: (think: boolean) => void;
  canThink: boolean;
  prompt: string;
  prompts: Record<string, string>;
  seed: number;
  seedEnabled: boolean;
  setSeed: (seed: number) => void;
  setSeedEnabled: (enabled: boolean) => void;
  setPrompt: (prompt: string) => void;
  modelInformation: Record<string, ModelInformation>;
};

const logger = new Logger("ModelContext");

const noop = () => null;

const initialState: ModelContextState = {
  models: [],
  model: "",
  setModel: noop,
  think: true,
  setThink: noop,
  canThink: false,
  prompt: "",
  prompts: {},
  seed: 1,
  seedEnabled: false,
  setSeed: noop,
  setSeedEnabled: noop,
  setPrompt: noop,
  modelInformation: {},
};

const ModelContext = createContext<ModelContextState>(initialState);

export const useModelContext = () => useContext(ModelContext);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [model, _setModel] = useState("");
  const [storedModel, setStoredModel] = Hooks.useLocalStorage("model", "");
  const [think, setThink] = useState(false);
  const [prompt, setPrompt] = useState(Object.values(PROMPTS)[0]);
  const [modelInformation, setModelInformation] = useState<
    ModelContextState["modelInformation"]
  >({});
  const modelInfoTriesRef = useRef<Map<string, number>>(new Map());

  const [seedEnabled, setSeedEnabled] = useState(false);
  const [seed, setSeed] = Hooks.useLocalStorage<number>("seed", 1);

  const setModel = useCallback(
    (nextModel: string) => {
      if (model) {
        API.unloadModel({ model_name: model });
      }
      API.loadModel({ model_name: nextModel });
      _setModel(nextModel);
      setStoredModel(nextModel);
    },
    [model, _setModel, setStoredModel],
  );

  useEffect(() => {
    const getModels = async () => {
      const modelList = await API.listLocalModels();
      if (modelList.length) {
        setModels(modelList);
        const hasStoredModel = !!modelList.find((m) => m.name === storedModel);
        setModel(hasStoredModel ? storedModel : modelList[0].name);
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
      toast.warning("Couldn't get model information");
      console.warn("retry limit reached");
      return;
    } else {
      tries.set(model, curr + 1);
    }

    API.showModelInformation({
      model_name: model,
    }).then((modelInfo) => {
      if (!modelInfo) {
        return;
      }
      setModelInformation((prev) => {
        return { ...prev, [model]: modelInfo };
      });
    });
  }, [model, modelInformation, setModelInformation]);

  const value = useMemo(
    () => ({
      canThink: modelInformation[model]?.capabilities.some(
        (c) => c === "thinking",
      ),
      model,
      models,
      modelInformation,
      prompt,
      prompts: PROMPTS,
      seed,
      seedEnabled,
      setModel,
      setPrompt,
      setSeedEnabled,
      setThink,
      setSeed,
      think,
    }),
    [
      model,
      models,
      modelInformation,
      prompt,
      seed,
      seedEnabled,
      setModel,
      setSeed,
      setSeedEnabled,
      setThink,
      think,
    ],
  );

  useEffect(() => {
    if (!value.canThink && think) {
      setThink(false);
    }
  }, [value.canThink, think]);

  useEffect(() => {
    logger.debug(value);
  }, [value]);

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
