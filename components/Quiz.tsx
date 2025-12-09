import React, { useState, useEffect } from 'react';
import { questions } from '../data';
import { AnswerStatus } from '../types';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award } from 'lucide-react';

export const Quiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isMultipleChoice = currentQuestion.correct_options.length > 1;

  useEffect(() => {
    // Reset state when question changes
    setSelectedIndices([]);
    setIsAnswered(false);
  }, [currentIndex]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;

    if (isMultipleChoice) {
      setSelectedIndices(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setSelectedIndices([index]);
    }
  };

  const submitAnswer = () => {
    setIsAnswered(true);
    
    // Check correctness
    const correctSet = new Set<number>(currentQuestion.correct_options);
    const selectedSet = new Set<number>(selectedIndices);
    
    // For single choice, simple equality check
    // For multi choice, must select ALL correct options and NO incorrect ones? 
    // Or just partial credit? Strict equality is standard for these tests.
    let isCorrect = false;
    if (selectedSet.size === correctSet.size) {
        isCorrect = [...selectedSet].every((val) => correctSet.has(val));
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedIndices([]);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 space-y-6 animate-fade-in text-center">
        <Award size={64} className="text-yellow-400" />
        <h2 className="text-3xl font-bold text-white">Quiz Completed!</h2>
        <div className="text-xl text-gray-300">
          You scored <span className="font-bold text-green-400">{score}</span> out of <span className="font-bold">{questions.length}</span>
        </div>
        <p className="text-gray-400">
          {(score / questions.length) * 100 > 70 ? "Great job! You know Go well." : "Keep practicing to master Go internals."}
        </p>
        <button
          onClick={restartQuiz}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          <RotateCcw size={20} />
          <span>Restart Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 w-full">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center text-sm text-gray-400">
        <span className="bg-zinc-800 px-3 py-1 rounded-full text-zinc-300 font-medium border border-zinc-700">
          {currentQuestion.topic}
        </span>
        <span>{currentIndex + 1} / {questions.length}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
        {currentQuestion.question_text}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let buttonStyle = "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-gray-300";
          
          if (isAnswered) {
             const isSelected = selectedIndices.includes(idx);
             const isCorrect = currentQuestion.correct_options.includes(idx);

             if (isCorrect) {
                // Always highlight correct answer green
                buttonStyle = "border-green-500/50 bg-green-500/10 text-green-200 ring-1 ring-green-500/50";
             } else if (isSelected && !isCorrect) {
                // Wrong selection red
                buttonStyle = "border-red-500/50 bg-red-500/10 text-red-200 ring-1 ring-red-500/50";
             } else {
               // Unselected wrong answers dim
               buttonStyle = "border-zinc-800 bg-zinc-900/50 text-gray-500 opacity-50";
             }
          } else if (selectedIndices.includes(idx)) {
             // Selected state before submit
             buttonStyle = "border-blue-500 bg-blue-500/10 text-blue-200 ring-1 ring-blue-500";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-xl border transition-all duration-200 flex items-start group ${buttonStyle}`}
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {isAnswered && currentQuestion.correct_options.includes(idx) ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : isAnswered && selectedIndices.includes(idx) && !currentQuestion.correct_options.includes(idx) ? (
                  <XCircle size={20} className="text-red-500" />
                ) : (
                  <div className={`w-5 h-5 rounded border ${selectedIndices.includes(idx) ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 group-hover:border-zinc-500'} flex items-center justify-center transition-colors`}>
                    {selectedIndices.includes(idx) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                )}
              </div>
              <span className="leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Actions / Feedback */}
      <div className="min-h-[120px]">
        {!isAnswered ? (
          <button
            onClick={submitAnswer}
            disabled={selectedIndices.length === 0}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            Check Answer
          </button>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Explanation</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {currentQuestion.explanation}
              </p>
            </div>
            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-white text-black hover:bg-gray-100 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-white/10"
            >
              <span>{currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};