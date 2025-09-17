import { toast } from "sonner";

import { Logger } from "./log";
import * as Util from "./util";
import {
  type Model,
  type Message,
  type ChatCompletionChunk,
  type ModelInformation,
  Role,
  type RunningModel,
} from "./types";

const url_base = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL_DEV
  : import.meta.env.VITE_API_URL_PROD;

if (!url_base) {
  throw new Error("Expected url_base to be defined");
}

const _logger = new Logger("api");

export async function listLocalModels() {
  const logger = _logger.child("listLocalModels").debug("start");
  try {
    const response = await fetch(url_base + "/tags");
    const data = (await response.json()) as { models: Model[] };
    return Util.sortModels(data.models);
  } catch (error) {
    logger.error(error);
    toast.error(String(error));
    return [];
  }
}

export async function generateChatCompletion(params: {
  model: string;
  messages: Message[];
  seed: number | null;
  think: boolean;
  onContent: (content: ChatCompletionChunk) => void;
  onError?: (e: unknown) => void;
  controller: AbortController;
  summary: string;
  systemPrompt: string;
}) {
  const logger = _logger.child("generateChatCompletion").debug("start", params);
  const {
    model,
    messages,
    think,
    onContent,
    seed: seedFromApp,
    systemPrompt,
  } = params;

  const chatSummaryEnabled = true;

  const hasSystemPrompt = messages.some((m) => m.role === Role.System);
  const seed = seedFromApp ? seedFromApp : undefined;

  const messagesToSend = chatSummaryEnabled ? messages.slice(-1) : messages;

  //TODO: inject summary to last user message

  const options = {
    seed,
  };

  const prompt =
    systemPrompt && !hasSystemPrompt
      ? {
          role: Role.System,
          content: systemPrompt,
        }
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
        options,
        think,
      }),
      signal: params.controller.signal,
    });

    if (!response || !response.body) {
      throw new Error("No response");
    }

    if (!("getReader" in response.body)) {
      throw new Error("Streaming not supported by this browser");
    }

    const onText = (text: string) => {
      const chunks = Util.parseConcatenatedJson<ChatCompletionChunk>(text);
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
  } catch (err) {
    logger.error(err);
    if (err instanceof Error && err.name === "AbortError") {
      toast("Generation aborted");
    } else {
      toast.error(String(err));
    }
    params.onError?.(err);
    return [];
  }
}

export async function generateChatSummary(params: {
  model: string;
  messages: Message[];
  controller: AbortController;
  onContent: (body: ChatCompletionChunk) => void;
  onError: () => void;
}) {
  const logger = _logger.child("generateChatSummary").debug("start", params);
  const { model, messages } = params;

  const prompt = {
    role: Role.System,
    content:
      "Summarize what was the user has said and your responses. Be extremely concise. If specific things were mentioned, list them as examples of the broader topics. Respond with only text, no formatting",
  };

  try {
    const response = await fetch(url_base + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          prompt,
          ...messages,
          { role: Role.User, content: prompt.content },
        ],
        think: false,
        stream: false,
      }),
      signal: params.controller.signal,
    });

    if (!response || !response.body) {
      throw new Error("No response");
    }

    const body = (await response.json()) as ChatCompletionChunk;
    logger.debug(body);
    params.onContent(body);
  } catch (err) {
    logger.error(err);
    params.onError();
  }
  return;
}

export async function showModelInformation(params: {
  model_name: string;
}): Promise<ModelInformation | undefined> {
  const logger = _logger.child("showModelInformation").debug("start", params);
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

interface ListRunningModelsResponse {
  models: RunningModel[];
}

export async function listRunningModels(): Promise<
  ListRunningModelsResponse | undefined
> {
  const logger = _logger.child("listRunningModels").debug("start");
  try {
    const response = await fetch(url_base + "/ps");
    const data = (await response.json()) as ListRunningModelsResponse;
    return data;
  } catch (error) {
    logger.error(error);
    toast.error(String(error));
    return undefined;
  }
}

export async function loadModel(params: { model_name: string }): Promise<void> {
  const logger = _logger.child("loadModel").debug("start", params);
  try {
    const response = await fetch(url_base + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model_name,
      }),
    });
    const data = await response.json();
    logger.debug("data", data);
  } catch (error) {
    logger.error(error);
    toast.error(String(error));
    return undefined;
  }
}

export async function unloadModel(params: {
  model_name: string;
}): Promise<void> {
  const logger = _logger.child("unloadModel").debug("start", params);
  try {
    const response = await fetch(url_base + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model_name,
        keep_alive: 0,
      }),
    });
    const data = await response.json();
    logger.debug("data", data);
  } catch (error) {
    logger.error(error);
    toast.error(String(error));
    return undefined;
  }
}
