import { parseConcatenatedJson } from "./utils/parseConcatenatedJson";
import { toast } from "sonner";

import { Logger } from "./log";
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
