import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Activity, ArrowLeft } from "lucide-react";

const allQuestions = [
  "How has your quality of sleep been over the last few nights?",
  "How often have you felt nervous, anxious, or on edge lately?",
  "How easily do you find yourself becoming frustrated or irritable?",
  "How often do you feel overwhelmed by the number of tasks on your plate?",
  "How would you rate your overall physical energy levels today?",
  "How often have you had trouble relaxing or \"switching off\" your brain?",
  "How much interest or pleasure have you felt in doing things you usually enjoy?",
  "How often have you felt down, depressed, or hopeless recently?",
  "How would you rate your ability to concentrate on a single task?",
  "How often do you experience physical tension, such as a tight jaw or shoulders?",
  "How satisfied are you with your social interactions and connections lately?",
  "How often do you feel like you are in control of the important things in your life?",
  "How would you rate your current appetite or eating habits?",
  "How often do you feel a sense of \"impending dread\" or worry about the future?",
  "How much do you feel that your daily activities are meaningful or purposeful?"
];

export default function Survey() {
  const navigate = useNavigate();
  
  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });
  
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelect = (questionIndex: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const isComplete = Object.keys(answers).length === questions.length;

  const handleSubmit = () => {
    if (!isComplete) return;
    const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
    navigate(`/results?score=${score}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex-1 flex flex-col bg-sky-50 dark:bg-[#121212] min-h-screen relative transition-colors duration-300"
    >
      <div className="p-8 pb-4 bg-white dark:bg-[#1a1a1a] border-b border-black/5 dark:border-white/10 z-10 shadow-sm relative flex flex-col transition-colors duration-300">
        <div className="flex items-start gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-black/5 dark:bg-white/10 text-slate-600 dark:text-gray-300 rounded-xl hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Wellness Check</h1>
        <p className="text-slate-500 dark:text-gray-400 text-lg leading-relaxed">
          Please answer the following questions on a scale of 1 to 5.<br/>
          <span className="text-sm font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mt-2 block">(1 = Very Low, 3 = Moderate, 5 = Very High)</span>
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 pb-12 flex flex-col gap-6">
        {questions.map((question, qIdx) => (
          <div key={qIdx} className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl shadow-sm border border-black/5 dark:border-white/10 transition-colors duration-300">
            <h3 className="font-semibold text-slate-800 dark:text-gray-200 mb-6 text-xl leading-snug">{qIdx + 1}. {question}</h3>
            <div className="flex justify-between items-center gap-2 relative">
              <div className="absolute inset-y-1/2 left-4 right-4 h-0.5 bg-black/5 dark:bg-white/10 -z-0 rounded-full" />
              {[1, 2, 3, 4, 5].map((value) => {
                const isSelected = answers[qIdx] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(qIdx, value)}
                    className={`
                      relative w-14 h-14 flex items-center justify-center rounded-full text-xl font-bold transition-all z-10 shadow-sm
                      ${isSelected 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-110' 
                        : 'bg-white dark:bg-[#222] text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-[#333] border-2 border-slate-200 dark:border-white/10'}
                    `}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 px-2 text-xs text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
              w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all
              ${isComplete 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:scale-[1.02]' 
                : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-gray-600 cursor-not-allowed'}
            `}
          >
            Analyze Results
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}