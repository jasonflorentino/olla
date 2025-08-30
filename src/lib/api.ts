import { parseConcatenatedJson } from "./utils/parseConcatenatedJson";
import { Logger } from "./log";

const url_base = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL_DEV
  : import.meta.env.VITE_API_URL_PROD;

if (!url_base) {
  throw new Error("Expected url_base to be defined");
}

const logger = new Logger("api");

interface ModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

export interface Model {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}

export async function listLocalModels() {
  logger.debug("listLocalModels");
  try {
    const response = await fetch(url_base + "/tags");
    const data = (await response.json()) as { models: Model[] };
    return data.models;
  } catch (error) {
    logger.error(error);
    return [];
  }
}

export type Role = "user" | "assistant" | "system";

export interface Message {
  key?: string;
  role: Role;
  content: string;
}

export type ChatCompletionChunk =
  | {
      done: false;
      model: string;
      created_at: string;
      message: Message;
    }
  | {
      done: true;
      model: string;
      created_at: string;
      message: Message;
      done_reason: string | "stop";
      total_duration: number;
      load_duration: number;
      prompt_eval_count: number;
      prompt_eval_duration: number;
      eval_count: number;
      eval_duration: number;
    };

export async function generateChatCompletion(params: {
  model: string;
  messages: Message[];
  think: boolean;
  onContent: (content: ChatCompletionChunk) => void;
  systemPrompt: string;
}) {
  logger.debug("generateChatCompletion", params);
  const { model, messages, think, onContent, systemPrompt } = params;

  const prompt = systemPrompt
    ? { role: "system", content: systemPrompt }
    : undefined;

  try {
    const response = await fetch(url_base + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: prompt ? [prompt, ...messages] : messages,
        think,
      }),
    });

    if (!response || !response.body) {
      throw new Error("No response");
    }

    const decoder = new TextDecoder();
    const body = response.body as unknown as AsyncIterable<Uint8Array>;

    for await (const chunk of body) {
      const decoded = decoder.decode(chunk);
      if (!decoded) {
        continue;
      }
      const chunks = parseConcatenatedJson<ChatCompletionChunk>(decoded);
      chunks.forEach(onContent);
    }
  } catch (error) {
    logger.error(error);
    return [];
  }
}

type Capability = "completion" | "thinking" | "vision";

export interface ModelInformation {
  modelfile: string;
  parameters: string;
  template: string;
  details: ModelDetails;
  model_info: {
    "general.architecture": string;
    "general.file_type": number;
    "general.parameter_count": number;
    "general.quantization_version": number;
    "llama.attention.head_count": number;
    "llama.attention.head_count_kv": number;
    "llama.attention.layer_norm_rms_epsilon": number;
    "llama.block_count": number;
    "llama.context_length": number;
    "llama.embedding_length": number;
    "llama.feed_forward_length": number;
    "llama.rope.dimension_count": number;
    "llama.rope.freq_base": number;
    "llama.vocab_size": number;
    "tokenizer.ggml.bos_token_id": number;
    "tokenizer.ggml.eos_token_id": number;
    "tokenizer.ggml.merges": string[]; // populates if `verbose=true`
    "tokenizer.ggml.model": string;
    "tokenizer.ggml.pre": string;
    "tokenizer.ggml.token_type": string[]; // populates if `verbose=true`
    "tokenizer.ggml.tokens": string[]; // populates if `verbose=true`
  };
  capabilities: Capability[];
}

export async function showModelInformation(params: {
  model_name: string;
}): Promise<ModelInformation | undefined> {
  logger.debug("showModelInformation", params);
  try {
    const response = await fetch(url_base + "/show", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model_name,
      }),
    });
    const data = (await response.json()) as ModelInformation;
    return data;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
}
