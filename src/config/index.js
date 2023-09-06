if (!process.env.OPEN_AI_KEY) {
  throw new Error("OPEN_AI_KEY environment variable is not defined");
}

export const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
