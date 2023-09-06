"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { categoryMap } from "@/lib/categories";
import { checkAnswers } from "@/app/actions";
import { TRIVIA_API_BASE_URL } from "@/config";

interface Question {
  category: string;
  id: string;
  tags: string[];
  difficulty: string;
  regions: string[];
  isNiche: boolean;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  type: string;
}

// Define your API endpoint
const API_URL = TRIVIA_API_BASE_URL + "/questions";

const shuffleAnswers = (question: Question) => {
  const answers = [...question.incorrectAnswers, question.correctAnswer];
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
};

function QuizPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const [quizData, setQuizData] = useState<
    Array<Question & { answers: string[] }>
  >([]);

  // Define a query key based on the selected category
  const queryKey = ["quiz", category];

  // Fetch quiz questions using React Query
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axios.get<Question[]>(
        `${API_URL}?categories=${category}&limit=5&difficulties="easy"&region=US`
      );
      return response.data;
    },
    enabled: !quizData.length,
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const shuffledData = data.map((question) => ({
        ...question,
        answers: shuffleAnswers(question),
      }));
      setQuizData(shuffledData);
    }
  }, [data, isLoading, isError]);

  const { handleSubmit, control, trigger } = useForm();

  const onSubmit = (data: any) => {
    // Handle form data as needed, e.g., check answers
    console.log("Submitted data:", data);
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">
          Quiz - {categoryMap[category as keyof typeof categoryMap]}
        </h1>
        {isLoading ? (
          <p className="text-gray-500">Loading quiz questions...</p>
        ) : isError ? (
          <p className="text-red-500">Error loading quiz questions.</p>
        ) : (
          quizData && (
            <form
              action={async (formData) => {
                const valid = await trigger();
                console.log(valid);
                if (valid) {
                  await checkAnswers(formData);
                }
              }}
            >
              {quizData.map((question) => (
                <div key={question.id} className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">
                    {question.question}
                  </h2>
                  <ul className="list-none ml-6">
                    {question.answers.map((answer, optionIndex) => (
                      <li key={optionIndex} className="mb-2">
                        <label className="inline-flex items-center">
                          <Controller
                            name={`${question.id}`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <input
                                className="mr-2"
                                type="radio"
                                {...field}
                                value={answer}
                              />
                            )}
                          />
                          <span className="text-gray-700">{answer}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Submit
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}

export default QuizPage;
