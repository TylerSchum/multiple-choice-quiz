"use server";
import axios from "axios";
import { redirect } from "next/navigation";

export async function checkAnswers(formData: FormData) {
  const formDataTuples = Array.from(formData.entries());
  if (formDataTuples.length !== 5) throw new Error("Expected 5 answers");
  const questionAnswerMap = formDataTuples.reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (typeof value !== "string") throw new Error("Expected string");
      acc[key] = value;
      return acc;
    },
    {}
  );
  let correctAnswerCount = 0;
  for (const questionId of Object.keys(questionAnswerMap)) {
    try {
      const questionData = await axios.get(
        "https://the-trivia-api.com/api/question/" + questionId
      );
      const correctAnswer = questionData.data.correctAnswer;
      if (questionAnswerMap[questionId] === correctAnswer) {
        correctAnswerCount++;
      }
    } catch (e) {
      console.log(e);
      throw new Error("Question not found");
    }
  }
  redirect("/results?correct=" + correctAnswerCount);
}
