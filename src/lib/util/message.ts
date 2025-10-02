import type { Message, MessageMeta, ChatCompletionChunk, Role } from "../types";

export function getMessageMeta(c: ChatCompletionChunk): MessageMeta {
  const {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    message,
    ...rest
  } = c;
  return rest;
}

export function toMessage(role: Role, content: string): Message {
  return {
    role,
    content,
  };
}
