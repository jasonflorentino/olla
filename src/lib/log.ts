export class Logger {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  child(name: string) {
    return new Logger(`${this.name}:${name}`);
  }
  debug(...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.log(`[${this.name}] `, ...args);
    }
    return this;
  }
  warn(...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.warn(`[${this.name}] `, ...args);
    }
    return this;
  }
  error(...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.error(`[${this.name}] `, ...args);
    }
    return this;
  }
}
