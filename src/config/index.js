if (!process.env.TRIVIA_API_BASE_URL) {
  throw new Error("TRIVIA_API_BASE_URL environment variable is not defined");
}

export const TRIVIA_API_BASE_URL = process.env.TRIVIA_API_BASE_URL;

if (!process.env.OPEN_AI_KEY) {
  throw new Error("OPEN_AI_KEY environment variable is not defined");
}

export const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
