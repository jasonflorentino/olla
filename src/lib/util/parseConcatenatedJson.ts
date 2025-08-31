/**
 * Parse a string containing concatenated JSON values (objects/arrays),
 * separated by arbitrary whitespace or text, into an array of parsed values.
 * Handles nested structures and quotes/escapes correctly.
 */
export function parseConcatenatedJson<T = unknown>(input: string): T[] {
  const out: T[] = [];
  let depth = 0; // nesting of { } or [ ]
  let inString = false; // currently inside a "..."
  let escape = false; // last char was a backslash inside a string
  let start = -1; // start index of current JSON value

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inString) {
      if (escape) {
        // escaped character inside string
        escape = false;
        continue;
      }
      if (ch === "\\") {
        // begin escape
        escape = true;
        continue;
      }
      if (ch === '"') {
        // end string
        inString = false;
      }
      continue;
    }

    // not in string
    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{" || ch === "[") {
      if (depth === 0) start = i; // start of a new JSON value
      depth++;
      continue;
    }

    if (ch === "}" || ch === "]") {
      depth--;
      if (depth === 0 && start !== -1) {
        const jsonText = input.slice(start, i + 1);
        out.push(JSON.parse(jsonText));
        start = -1; // ready for the next value
      }
      continue;
    }
  }

  if (depth !== 0 || inString) {
    throw new Error("Truncated or malformed JSON sequence");
  }

  return out;
}
