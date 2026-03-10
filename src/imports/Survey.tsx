import { useState, useRef, useEffect } from "react"; // Intent: Import React hooks needed for state management (useState), DOM referencing (useRef), and side effects (useEffect).
import { useNavigate } from "react-router"; // Intent: Import hook to programmatically navigate between pages.
import { motion } from "motion/react"; // Intent: Import motion for smooth page transitions and component animations.
import { ArrowRight, Activity, ArrowLeft } from "lucide-react"; // Intent: Import SVG icons for UI buttons and visual indicators.

// Intent: Define the comprehensive list of 15 questions to evaluate the user's mental wellbeing and current state.
const allQuestions = [
  "How has your quality of sleep been over the last few nights?", // Intent: Question 1 focusing on sleep quality.
  "How often have you felt nervous, anxious, or on edge lately?", // Intent: Question 2 focusing on anxiety levels.
  "How easily do you find yourself becoming frustrated or irritable?", // Intent: Question 3 focusing on irritability.
  "How often do you feel overwhelmed by the number of tasks on your plate?", // Intent: Question 4 focusing on task overwhelm.
  "How would you rate your overall physical energy levels today?", // Intent: Question 5 focusing on physical energy.
  "How often have you had trouble relaxing or \"switching off\" your brain?", // Intent: Question 6 focusing on mental relaxation.
  "How much interest or pleasure have you felt in doing things you usually enjoy?", // Intent: Question 7 focusing on anhedonia/pleasure.
  "How often have you felt down, depressed, or hopeless recently?", // Intent: Question 8 focusing on depression symptoms.
  "How would you rate your ability to concentrate on a single task?", // Intent: Question 9 focusing on concentration/focus.
  "How often do you experience physical tension, such as a tight jaw or shoulders?", // Intent: Question 10 focusing on physical manifestation of stress.
  "How satisfied are you with your social interactions and connections lately?", // Intent: Question 11 focusing on social wellbeing.
  "How often do you feel like you are in control of the important things in your life?", // Intent: Question 12 focusing on sense of control.
  "How would you rate your current appetite or eating habits?", // Intent: Question 13 focusing on physiological signs (appetite).
  "How often do you feel a sense of \"impending dread\" or worry about the future?", // Intent: Question 14 focusing on dread/worry.
  "How much do you feel that your daily activities are meaningful or purposeful?" // Intent: Question 15 focusing on purpose and meaning.
];

export function Survey() { // Intent: Export the main Survey component for routing.
  const navigate = useNavigate(); // Intent: Initialize navigation function to move to Results page or back home.
  
  // Intent: Initialize the questions state once using a lazy initializer function to ensure randomization happens only on the first render.
  const [questions] = useState(() => {
    // Intent: Create a shallow copy of allQuestions and randomize the array order using a simple sort calculation.
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    // Intent: Slice the first 5 questions from the shuffled array to present a short, efficient quiz to the user.
    return shuffled.slice(0, 5);
  });
  
  // Intent: Initialize state to store the user's answers. It's an object mapping question index to a score (1-5).
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  // Intent: Create a reference to the scrollable container in case we need to programmatically scroll later.
  const scrollRef = useRef<HTMLDivElement>(null);

  // Intent: Handler function when a user taps an answer button. Takes the question index and selected score.
  const handleSelect = (questionIndex: number, value: number) => {
    // Intent: Update the answers state by spreading previous answers and setting the specific question's value.
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  // Intent: Determine if the survey is complete by checking if the number of answered questions equals the total questions asked.
  const isComplete = Object.keys(answers).length === questions.length;

  // Intent: Handler function when the user taps "Analyze Results".
  const handleSubmit = () => {
    // Intent: Prevent submission if the survey is not completely filled out.
    if (!isComplete) return;
    // Intent: Calculate the total score by summing up all the numeric values in the answers object.
    const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
    // Intent: Navigate to the results page and pass the calculated score as a URL query parameter.
    navigate(`/results?score=${score}`);
  };

  return (
    // Intent: Provide an animated wrapper div that fades in when the component mounts.
    <motion.div 
      initial={{ opacity: 0 }} // Intent: Start fully transparent.
      animate={{ opacity: 1 }} // Intent: Animate to fully opaque.
      className="flex-1 flex flex-col bg-neutral-50 relative min-h-0" // Intent: Flexbox column layout taking full height, light gray background, allowing scrolling children.
    >
      {/* Intent: Render the sticky header containing the back button, title, and instructions */}
      <div className="p-8 pb-4 bg-white border-b border-neutral-100 z-10 shadow-sm relative flex flex-col">
        <div className="flex items-start gap-4 mb-6">
          {/* Intent: Back button to allow users to easily return to the previous screen (Safety Gate). */}
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          {/* Intent: Decorative icon container to signify "Activity" or health checking. */}
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        {/* Intent: Main page title clearly indicating this is the Wellness Check survey. */}
        <h1 className="text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">Wellness Check</h1>
        {/* Intent: Brief instructions explaining the 1-5 scale to the user. */}
        <p className="text-neutral-500 text-lg leading-relaxed">
          Please answer the following questions on a scale of 1 to 5.<br/>
          <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mt-2 block">(1 = Very Low, 3 = Moderate, 5 = Very High)</span>
        </p>
      </div>

      {/* Intent: Render the scrollable list of questions. */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 pb-12 flex flex-col gap-6">
        {/* Intent: Map over the 5 randomized questions to render individual question cards. */}
        {questions.map((question, qIdx) => (
          <div key={qIdx} className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200">
            {/* Intent: Display the question number (1-based index) and the text of the question. */}
            <h3 className="font-semibold text-neutral-800 mb-6 text-xl leading-snug">{qIdx + 1}. {question}</h3>
            {/* Intent: Container for the horizontal row of score buttons. */}
            <div className="flex justify-between items-center gap-2 relative">
              {/* Intent: Render a visual horizontal line behind the buttons to connect them like a slider track. */}
              <div className="absolute inset-y-1/2 left-4 right-4 h-0.5 bg-neutral-100 -z-0 rounded-full" />
              {/* Intent: Generate the 5 score buttons (1 through 5). */}
              {[1, 2, 3, 4, 5].map((value) => {
                const isSelected = answers[qIdx] === value; // Intent: Determine if the current button is the user's selected answer.
                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(qIdx, value)}
                    className={`
                      relative w-14 h-14 flex items-center justify-center rounded-full text-xl font-bold transition-all z-10 shadow-sm
                      ${isSelected 
                        ? 'bg-neutral-900 text-white shadow-xl scale-110' 
                        : 'bg-white text-neutral-500 hover:bg-neutral-100 border-2 border-neutral-200'}
                    `}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            {/* Intent: Display text labels below the buttons to reinforce the scale (Very Low to Very High). */}
            <div className="flex justify-between mt-4 px-2 text-xs text-neutral-400 font-bold uppercase tracking-wider">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>
        ))}

        {/* Intent: Container for the submit button at the very bottom of the scrollable list. */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
              w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all
              ${isComplete 
                ? 'bg-neutral-900 text-white shadow-xl hover:bg-neutral-800 hover:scale-[1.02]' 
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}
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
