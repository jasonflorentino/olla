export class Logger {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  debug(...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.log(`[${this.name}] `, ...args);
    }
  }
  error(...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.error(`[${this.name}] `, ...args);
    }
  }
}
