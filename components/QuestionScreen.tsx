import React, { useState } from 'react';
import { QUESTION_PROMPTS } from '../constants';

interface QuestionScreenProps {
  onSubmit: (questions: string[]) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ onSubmit }) => {
  const [questions, setQuestions] = useState<string[]>(['', '', '']);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuestions = questions.map((q, i) => q.trim() === '' ? QUESTION_PROMPTS[i] : q);
    onSubmit(finalQuestions);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-white">
      <h2 className="font-cinzel text-3xl text-center text-pink-300 mb-6">Formula tus Preguntas</h2>
      <p className="text-center text-pink-200 mb-8">
        Enfoca tu intención en tres áreas de tu vida. Puedes usar las sugerencias o escribir las tuyas.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {QUESTION_PROMPTS.map((prompt, index) => (
          <div key={index}>
            <label htmlFor={`question-${index}`} className="block text-sm font-medium text-pink-300 mb-1">{`Pregunta ${index + 1}`}</label>
            <input
              id={`question-${index}`}
              type="text"
              value={questions[index]}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder={prompt}
              className="w-full bg-gray-800/50 border-2 border-fuchsia-500/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-colors"
            />
          </div>
        ))}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-pink-500/30 transition-all duration-300 transform hover:scale-105"
          >
            Barajar y Tirar las Cartas
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionScreen;