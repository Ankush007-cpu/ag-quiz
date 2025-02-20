import { TimerIcon } from "lucide-react";

function Timer({ timeLeft }) {
  return (
    <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-700 mb-8">
      <TimerIcon className="w-6 h-6" />
      <span>{timeLeft}s</span>
    </div>
  );
}

export default Timer;
