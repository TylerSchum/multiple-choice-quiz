import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { openai } from "@/lib/openAI";
import axios from "axios";

const getOpenAIMessage = async (count: number) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Suggest a funny message based on ${count} correct answers out of 5. Use their number in the message.`,
      },
    ],
  });
  return response.choices[0].message.content;
};

export default function Results({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { correct } = searchParams;
  console.log(correct);
  const count = Number(correct);
  if (typeof count !== "number" || isNaN(count) || count > 5 || count < 0) {
    return <div>Invalid number of correct answers</div>;
  }
  const funnyMessage = getOpenAIMessage(count);
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col justify-center items-center px-10 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            You got{" "}
            <span className="text-green-500 font-semibold">{count}</span>{" "}
            correct answers out of 5.
          </p>
          <p className="text-blue-700 italic text-xl">{funnyMessage}</p>
        </CardContent>
      </Card>
    </div>
  );
}
