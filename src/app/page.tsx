"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { categoryMap } from "@/lib/categories";

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const startQuiz = () => {
    if (selectedCategory) {
      router.push(`/quiz/${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Quiz</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select a category:
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue focus:bg-white"
              onChange={(e) => handleCategoryChange(e.target.value)}
              value={selectedCategory || ""}
            >
              <option value="">Select a category</option>
              {Object.keys(categoryMap).map((category) => (
                <option key={category} value={category}>
                  {categoryMap[category as keyof typeof categoryMap]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={startQuiz}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
