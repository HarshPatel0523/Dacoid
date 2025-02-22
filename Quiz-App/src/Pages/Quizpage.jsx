/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Scoreboard from "../components/Scoreboard";

const Quizpage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetch("/quiz.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions))
      .catch((error) => console.error("Error loading questions:", error));
  }, []);

  useEffect(() => {
    if (timer > 0 && !quizFinished && !feedback) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && !quizFinished && !feedback) {
      handleTimeUp();
    }
  }, [timer, quizFinished, feedback]);

  const handleTimeUp = () => {
    setFeedback({ type: "timeout", message: "Time's up!" });
    setTimeout(() => {
      setFeedback(null);
      nextQuestion();
    }, 1500);
  };

  const checkAnswer = () => {
    if (!questions.length || isSubmitting || feedback) return;
    
    setIsSubmitting(true);
    
    const correct = questions[currentQuestion].answer;
    const isCorrect = 
      (questions[currentQuestion].type === "mcq" && selectedAnswer === correct) ||
      (questions[currentQuestion].type === "integer" && parseInt(selectedAnswer) === correct);
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ type: "correct", message: "Correct!" });
    } else {
      setFeedback({ type: "incorrect", message: "Incorrect" });
    }
    
    setTimeout(() => {
      setFeedback(null);
      nextQuestion();
      setIsSubmitting(false);
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimer(30);
    } else {
      setQuizFinished(true);
    }
  };

  // Progress calculation
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6">
      {/* Floating elements in background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-emerald-600/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl"></div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {quizFinished ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Scoreboard score={score} total={questions.length} />
          </motion.div>
        ) : questions.length > 0 ? (
          <>
            {/* Quiz Header */}
            <div className="mb-8 flex justify-between items-center">
              <motion.div 
                className="flex items-center bg-teal-900/30 backdrop-blur-lg rounded-full py-1 pl-1 pr-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-teal-500 text-slate-900 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {currentQuestion + 1}
                </div>
                <span className="text-teal-100 text-sm">of {questions.length}</span>
              </motion.div>
              
              <motion.div
                className="flex flex-col items-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="relative w-12 h-12 mb-1">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      className="text-slate-800"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r="20"
                      cx="24"
                      cy="24"
                    />
                    <circle
                      className="text-teal-400 transition-all duration-1000"
                      strokeWidth="4"
                      strokeDasharray={125.6}
                      strokeDashoffset={125.6 * (1 - timer/30)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="20"
                      cx="24"
                      cy="24"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-white">
                    {timer}
                  </div>
                </div>
                <span className="text-teal-200/70 text-xs">seconds left</span>
              </motion.div>
            </div>
            
            {/* Progress bar */}
            <motion.div 
              className="h-1.5 w-full bg-slate-800/50 rounded-full mb-10 overflow-hidden"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500"
                initial={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>
            
            {/* Quiz Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative"
              >
                {/* Feedback overlay */}
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm bg-slate-900/60 rounded-2xl"
                  >
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`py-3 px-8 rounded-full text-xl font-bold ${
                        feedback.type === "correct" ? "bg-emerald-500" :
                        feedback.type === "incorrect" ? "bg-rose-500" : "bg-amber-500"
                      }`}
                    >
                      {feedback.message}
                    </motion.div>
                  </motion.div>
                )}
                
                {/* Main Question Card with New Design */}
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Question content with new color scheme */}
                  <div className="bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 p-8 backdrop-blur-md border border-teal-500/20">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl translate-y-20 -translate-x-20"></div>
                    
                    {/* Question text with improved typography */}
                    <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200 mb-4 leading-tight">
                      {questions[currentQuestion].question}
                    </h2>
                    <p className="text-teal-200/60 text-sm uppercase tracking-wider font-medium mb-8">
                      {questions[currentQuestion].type === "mcq" ? "Select the best answer" : "Enter the correct number"}
                    </p>
                    
                    {/* Options section with custom styling */}
                    <div className="space-y-4 relative z-10">
                      <CustomQuestion
                        question={questions[currentQuestion]}
                        selectedAnswer={selectedAnswer}
                        setSelectedAnswer={setSelectedAnswer}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Submit button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onClick={checkAnswer}
              disabled={selectedAnswer === null || isSubmitting || feedback !== null}
              className={`mt-8 w-full py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2
                ${selectedAnswer === null || isSubmitting || feedback !== null
                  ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 font-semibold shadow-lg hover:shadow-teal-500/20'
                }`}
              whileHover={selectedAnswer !== null && !isSubmitting && feedback === null ? { scale: 1.02 } : {}}
              whileTap={selectedAnswer !== null && !isSubmitting && feedback === null ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-slate-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-800/30 backdrop-blur-md rounded-2xl border border-teal-900/30 p-8">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 rounded-full border-4 border-teal-500/30 border-t-teal-400 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-teal-400/20 animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-xl font-medium text-teal-100">Loading your quiz...</p>
            <p className="mt-2 text-teal-300/60">Preparing challenging questions</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Question component with better styling
const CustomQuestion = ({ question, selectedAnswer, setSelectedAnswer }) => {
  if (question.type === "mcq") {
    return (
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedAnswer(option)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start gap-4 border ${
              selectedAnswer === option
                ? "bg-teal-500/20 border-teal-400"
                : "bg-slate-800/60 border-slate-700/70 hover:bg-slate-700/50"
            }`}
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
              selectedAnswer === option
                ? "bg-teal-400 text-slate-900"
                : "bg-slate-700 text-slate-300"
            }`}>
              {String.fromCharCode(65 + index)}
            </div>
            <span className={`font-medium ${
              selectedAnswer === option
                ? "text-teal-100"
                : "text-slate-200"
            }`}>
              {option}
            </span>
          </motion.button>
        ))}
      </div>
    );
  } else if (question.type === "integer") {
    return (
      <div>
        <input
          type="number"
          value={selectedAnswer || ""}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          className="w-full bg-slate-800/80 text-teal-100 border-2 border-teal-500/30 focus:border-teal-400 rounded-lg p-4 text-xl font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          placeholder="Enter your answer..."
        />
      </div>
    );
  }
  
  return null;
};

export default Quizpage;