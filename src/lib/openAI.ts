import { OPEN_AI_KEY } from "@/config";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: OPEN_AI_KEY,
});
