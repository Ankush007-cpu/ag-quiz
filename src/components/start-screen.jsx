import { Play } from "lucide-react";

export default function StartScreen({ onStart }) {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Interactive Quiz Platform</h1>
      <p className="text-gray-600 mb-8">Test your knowledge!</p>
      <button
        onClick={onStart}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Play className="w-5 h-5 mr-2" />
        Start Quiz
      </button>
    </div>
  );
}
