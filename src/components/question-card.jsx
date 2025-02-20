import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  totalQuestions,
  currentQuestion,
}) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const isMultipleChoice = question.type !== "integer";

  useEffect(() => {
    setInputValue("");
    setIsCorrect(null);
    setSubmitted(false);
  }, [currentQuestion]);

  const getButtonClass = (index) => {
    if (!isMultipleChoice) return "";
    if (selectedAnswer === null) return "hover:bg-gray-100";
    if (index === question.correct) return "bg-green-100 border-green-500";
    if (selectedAnswer === index) return "bg-red-100 border-red-500";
    return "opacity-50";
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      const answer = parseInt(inputValue, 10);
      const correctAnswer = parseInt(question.correct, 10);
      setIsCorrect(answer === correctAnswer);
      setSubmitted(true);
      onAnswerSelect(answer);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Question {currentQuestion + 1} of {totalQuestions}
      </h2>
      <p className="text-gray-600 mb-4">{question.question}</p>

      {isMultipleChoice ? (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectedAnswer === null && onAnswerSelect(index)}
              className={`w-full p-4 text-left border rounded-lg transition-all duration-300 ${getButtonClass(index)}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedAnswer !== null &&
                  index === question.correct && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                {selectedAnswer === index &&
                  index !== question.correct && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <input
            type="number"
            className="w-full p-4 border rounded-lg"
            placeholder="Enter your answer"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={submitted}
          />
          <button
            onClick={handleSubmit}
            className="w-full mt-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            disabled={submitted}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
