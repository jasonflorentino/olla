import type { MessageMeta, ChatCompletionChunk } from "../types";

export function getMessageMeta(c: ChatCompletionChunk): MessageMeta {
  const {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    message,
    ...rest
  } = c;
  return rest;
}
