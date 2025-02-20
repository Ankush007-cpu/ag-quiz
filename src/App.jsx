import { useEffect, useState } from "react";
import GameOver from "./components/game-over";
import QuestionCard from "./components/question-card";
import StartScreen from "./components/start-screen";
import { QUESTIONS } from "./data/questions";
import Timer from "./components/timer";
import { saveQuizAttempt, getQuizHistory } from "./utils/indexedDB";

function App() {
  const [gameState, setGameState] = useState("start");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleStart = async () => {
    setGameState("playing");
    setTimeLeft(30);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);

    const storedHistory = await getQuizHistory();
    setHistory(storedHistory);
  };

  const handleAnswer = async (answer) => {
    setSelectedAnswer(answer);
    const currentQ = QUESTIONS[currentQuestion];

    let isCorrect = false;
    if (currentQ.type === "integer") {
      isCorrect = answer === currentQ.correctAnswer;
    } else {
      isCorrect = answer === currentQ.correct;
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      await saveQuizAttempt(score, QUESTIONS.length);
      setGameState("end");

      const storedHistory = await getQuizHistory();
      setHistory(storedHistory);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        {gameState === "start" && <StartScreen onStart={handleStart} />}
        {gameState === "playing" && (
          <div className="p-8">
            <Timer timeLeft={timeLeft} />
            <QuestionCard
              question={QUESTIONS[currentQuestion]}
              onAnswerSelect={handleAnswer}
              selectedAnswer={selectedAnswer}
              totalQuestions={QUESTIONS.length}
              currentQuestion={currentQuestion}
            />
            <div className="mt-6 text-center text-gray-600">
              Score: {score}/{QUESTIONS.length}
            </div>
          </div>
        )}
        {gameState === "end" && (
          <>
            <GameOver
              score={score}
              totalQuestions={QUESTIONS.length}
              onRestart={handleStart}
            />
            
            {history.length > 0 && (
              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-bold">Quiz Attempt History</h3>
                <ul className="mt-2">
                  {history.map((attempt, index) => (
                    <li key={index} className="text-gray-700">
                      {attempt.timestamp} - Score: {attempt.score}/
                      {attempt.totalQuestions}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
