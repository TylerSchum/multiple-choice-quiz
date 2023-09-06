"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { categoryMap } from "@/lib/categories";
import { checkAnswers } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

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
const API_URL = "https://the-trivia-api.com/api/questions";

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

  const form = useForm();

  const onSubmit = (data: any) => {
    // Handle form data as needed, e.g., check answers
    console.log("Submitted data:", data);
    return true;
  };

  return (
    <div className="max-w-md mx-auto my-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Quiz - {categoryMap[category as keyof typeof categoryMap]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {isLoading ? (
              <p className="text-gray-500">Loading quiz questions...</p>
            ) : isError ? (
              <p className="text-red-500">Error loading quiz questions.</p>
            ) : (
              quizData && (
                <Form {...form}>
                  <form
                    action={async () => {
                      const valid = await form.trigger();
                      console.log(valid);
                      if (valid) {
                        const formData = new FormData();
                        for (const [key, value] of Object.entries(
                          form.getValues()
                        )) {
                          formData.append(key, value);
                        }
                        await checkAnswers(formData);
                      }
                    }}
                  >
                    {quizData.map((question) => (
                      <FormField
                        key={question.id}
                        control={form.control}
                        name={`${question.id}`}
                        rules={{
                          required: "Please select an answer",
                        }}
                        render={({ field }) => (
                          <FormItem className="mb-6">
                            <FormLabel className="text-lg font-semibold">
                              {question.question}
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                className="ml-2 flex flex-col space-y-1"
                                onValueChange={field.onChange}
                              >
                                {question.answers.map((answer, optionIndex) => (
                                  <FormItem
                                    key={optionIndex}
                                    className="flex items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <RadioGroupItem value={answer} />
                                    </FormControl>
                                    <FormLabel>{answer}</FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    ))}
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuizPage;
