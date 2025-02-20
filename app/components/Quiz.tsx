import React from 'react';
import { QuizQuestion } from '../lect_1/types';

interface QuizProps {
  questions: QuizQuestion[];
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [showExplanation, setShowExplanation] = React.useState(false);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion(currentQuestion + 1);
  };

  if (currentQuestion >= questions.length) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Quiz Complete!</h3>
        <p className="text-xl text-center text-gray-700">
          Your score: {score} out of {questions.length}
        </p>
        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 block mx-auto"
          onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
          }}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Question {currentQuestion + 1}</h3>
      <p className="text-xl mb-6 text-center text-gray-700">{questions[currentQuestion].question}</p>
      <div className="space-y-4">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-4 text-left rounded-lg border ${
              selectedAnswer === option
                ? option === questions[currentQuestion].correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-red-100 border-red-500 text-red-800'
                : 'hover:bg-gray-100 border-gray-300 text-gray-800'
            }`}
            onClick={() => handleAnswer(option)}
            disabled={showExplanation}
          >
            {option}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-gray-800">
            {selectedAnswer === questions[currentQuestion].correctAnswer
              ? '✅ Correct!'
              : '❌ Incorrect'}
          </p>
          <button
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={nextQuestion}
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}