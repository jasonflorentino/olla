export const Page = {
  Home: "home",
  Settings: "settings",
} as const;

export type Page = (typeof Page)[keyof typeof Page];

export const Role = {
  User: "user",
  Assistant: "assistant",
  System: "system",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const Capability = {
  Completion: "completion",
  Thinking: "thinking",
  Vision: "vision",
} as const;

export type Capability = (typeof Capability)[keyof typeof Capability];

export interface Model {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}

interface ModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

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
