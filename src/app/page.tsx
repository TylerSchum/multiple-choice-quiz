"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { categoryMap } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const startQuiz = () => {
    if (selectedCategory) {
      router.push(`/quiz/${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Select a category</Label>
            <div className="relative">
              <Select
                onValueChange={(value) => handleCategoryChange(value)}
                value={selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {Object.keys(categoryMap).map((category) => (
                      <SelectItem key={category} value={category}>
                        {categoryMap[category as keyof typeof categoryMap]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startQuiz}>Start Quiz</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
