import { useSearchParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, Sparkles, RefreshCcw, Youtube, ArrowLeft, Cat, Wind } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BoxBreathingAnimation } from "../components/box-breathing";

const positiveAffirmations = [
  "I have survived 100% of my hardest days so far. 💪✨",
  "This feeling is a wave; it will peak, and then it will pass. 🌊🤍",
  "My value is not defined by how much I get done today. 🌸🪴",
  "I am safe in this moment, and I am doing the best I can. 🛡️🕊️",
  "I don't have to figure everything out right now. 🧩⏳",
  "Inhale calm, exhale the weight of the world. 😮‍💨🍃",
  "Slow down. You are allowed to take up space and take your time. 🐢💛",
  "I am in control of my breath, and my breath is steady. 🌬️🧘‍♀️",
  "Mistakes are just data; they do not define my character. 📊🌱",
  "I am worthy of rest, even when there is work left to do. 🛌☁️"
];

const catVideos = [
  "tpiyEe_CqB4",
  "ByH9LuSILxU",
  "hY7m5jjJ9mM",
  "1hHk5hEIqWE",
  "9UUxK_tA2M8"
];

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam, 10) : 0;
  
  const [showBreathing, setShowBreathing] = useState(false);
  const breathingRef = useRef<HTMLDivElement>(null);
  
  const isStressed = score > 12.5;

  useEffect(() => {
    if (showBreathing && breathingRef.current) {
      breathingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showBreathing]);

  const affirmation = positiveAffirmations[score % positiveAffirmations.length];
  const videoId = catVideos[score % catVideos.length];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-sky-50 dark:bg-[#121212] overflow-hidden min-h-screen relative transition-colors duration-300"
    >
      <div className="p-6 pt-8 border-b border-black/5 dark:border-white/10 flex items-center gap-4 bg-sky-50 dark:bg-[#121212] z-10 sticky top-0 transition-colors duration-300">
        <button onClick={() => navigate(-1)} className="p-3 bg-black/5 dark:bg-white/10 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Assessment Complete</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto pb-32">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center p-6 bg-neutral-50 rounded-full mb-6 shadow-sm"
          >
            {isStressed ? (
              <Heart className="w-16 h-16 text-rose-500" fill="currentColor" />
            ) : (
              <Sparkles className="w-16 h-16 text-emerald-500" />
            )}
          </motion.div>
          <h2 className="text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">
            {isStressed ? "You seem a bit stressed." : "You're doing okay!"}
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed max-w-[280px] mx-auto">
            {isStressed 
              ? "Your responses indicate high levels of capacity load and tension. It's time to step back." 
              : "Your stress levels are within a manageable range. Keep up your healthy habits!"}
          </p>
        </div>

        {isStressed && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 p-8 rounded-[2rem] relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 text-rose-200/40 transform rotate-12">
                <Heart className="w-48 h-48" fill="currentColor" />
              </div>
              <h3 className="text-rose-900 font-bold mb-4 text-sm tracking-widest uppercase relative z-10">Words of Affirmation</h3>
              <p className="text-rose-950 text-2xl font-bold leading-tight relative z-10">
                "{affirmation}"
              </p>
            </div>

            <div ref={breathingRef} className="bg-white dark:bg-black/40 p-8 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-xl transition-colors duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                  <Wind className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Breathing Exercise</h3>
              </div>
              
              {!showBreathing ? (
                <div className="text-center">
                  <p className="text-slate-600 dark:text-gray-400 text-base mb-6 leading-relaxed">
                    Take a moment to center yourself. The fourfold breath exercise helps regulate your nervous system and reduce acute stress.
                  </p>
                  <button 
                    onClick={() => setShowBreathing(true)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md"
                  >
                    Start Fourfold Breath
                  </button>
                </div>
              ) : (
                <div className="bg-sky-50/50 dark:bg-blue-950/40 rounded-2xl p-4 border border-blue-100 dark:border-blue-500/20">
                  <BoxBreathingAnimation 
                    onComplete={() => setShowBreathing(false)} 
                    onEarlyEnd={() => setShowBreathing(false)} 
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-900 dark:bg-neutral-950 p-8 rounded-[2rem] text-white shadow-xl transition-colors duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <Youtube className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-bold text-xl tracking-tight">Physiological Cooling</h3>
              </div>
              <p className="text-slate-300 dark:text-neutral-400 text-base mb-6 leading-relaxed font-medium">
                Let's break the cycle. Watch the cat video below to calm yourself down.
              </p>
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 dark:border-neutral-800 shadow-inner">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600">
                  <Cat className="w-12 h-12 mb-2 opacity-50"/>
                  <span className="text-sm font-semibold tracking-wider uppercase">Loading Calming Content...</span>
                </div>
                <iframe 
                  className="w-full h-full absolute inset-0 z-10"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`} 
                  title="Calming Cat Videos" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}

        {!isStressed && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-8 rounded-[2rem] text-center shadow-sm"
          >
             <p className="text-emerald-900 text-xl font-bold leading-relaxed">
               Taking time to check in with yourself is a great habit. Have a wonderful day!
             </p>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 z-20">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-900 font-black text-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <RefreshCcw className="w-6 h-6" />
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
}