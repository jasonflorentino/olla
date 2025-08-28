import { parseConcatenatedJson } from "./utils/parseConcatenatedJson";

const url_base = "http://localhost:11434/api";

export interface Model {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export async function listLocalModels() {
  try {
    const response = await fetch(url_base + "/tags");
    const data = (await response.json()) as { models: Model[] };
    return data.models;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export interface Message {
  role: "user" | "assistant";
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

export async function generateChatCompletion({
  model,
  messages,
  onContent,
}: {
  model: string;
  messages: Message[];
  onContent: (content: ChatCompletionChunk) => void;
}) {
  try {
    const response = await fetch(url_base + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
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
    console.error(error);
    return [];
  }
}
