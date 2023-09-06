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
    <div className="h-[calc(100vh-64px)] bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold mb-4">Results</h1>
        <p className="text-lg mb-4">
          You got <span className="text-green-500 font-semibold">{count}</span>{" "}
          correct answers out of 5.
        </p>
        <p className="text-lg mb-4">
          Here&apos;s a funny message based on your score:
        </p>
        <p className="text-blue-700 italic text-xl">{funnyMessage}</p>
      </div>
    </div>
  );
}
