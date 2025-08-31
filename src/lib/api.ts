import { toast } from "sonner";

import { Logger } from "./log";
import { parseConcatenatedJson } from "./util";
import {
  type Model,
  type Message,
  type ChatCompletionChunk,
  type ModelInformation,
} from "./types";

const url_base = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL_DEV
  : import.meta.env.VITE_API_URL_PROD;

if (!url_base) {
  throw new Error("Expected url_base to be defined");
}

const logger = new Logger("api");

export async function listLocalModels() {
  logger.debug("listLocalModels");
  try {
    const response = await fetch(url_base + "/tags");
    const data = (await response.json()) as { models: Model[] };
    return data.models;
  } catch (error) {
    logger.error(error);
    toast.error(String(error));
    return [];
  }
}

export async function generateChatCompletion(params: {
  model: string;
  messages: Message[];
  think: boolean;
  onContent: (content: ChatCompletionChunk) => void;
  onError?: (e: unknown) => void;
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

    if (!("getReader" in response.body)) {
      throw new Error("Streaming not supported by this browser");
    }

    const onText = (text: string) => {
      const chunks = parseConcatenatedJson<ChatCompletionChunk>(text);
      chunks.forEach(onContent);
    };

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    try {
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (!value) {
          continue;
        }
        const chunkText = decoder.decode(value, {
          stream: true,
        });
        if (!chunkText) {
          continue;
        }
        onText(chunkText);
      }
    } finally {
      const tail = decoder.decode();
      if (tail) {
        onText(tail);
      }
      reader.releaseLock();
    }
  } catch (error) {
    logger.error(error);
    toast.error(String(error));
    params.onError?.(error);
    return [];
  }
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
    toast.error(String(error));
    return undefined;
  }
}
