import { Link } from "react-router";
import { Heart, ArrowLeft, Wind, Activity } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useHealth } from "../context/health-context";
import { BoxBreathingAnimation } from "../components/box-breathing";

export default function Calm() {
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalStressReduction, setTotalStressReduction] = useState(0);
  const [showBreathingCircle, setShowBreathingCircle] = useState(false);
  const { bloodPressure, heartRate } = useHealth();
  
  const [sessionData, setSessionData] = useState<Array<{
    heartRate: number;
    respiration: number;
    stress: number;
    timestamp: string;
  }>>([]);

  const handleSessionComplete = () => {
    const newSession = {
      heartRate: Math.floor(Math.random() * 10) + 65,
      respiration: Math.floor(Math.random() * 3) + 12,
      stress: Math.floor(Math.random() * 20) + 10,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setSessionData(prev => [...prev, newSession]);
    setCompletedSessions(prev => prev + 1);
    setTotalStressReduction(prev => prev + 15);
    setShowBreathingCircle(false);
  };

  const handleEarlyEnd = (sessionTime: number) => {
    const newSession = {
      heartRate: Math.floor(Math.random() * 10) + 65,
      respiration: Math.floor(Math.random() * 3) + 12,
      stress: Math.floor(Math.random() * 20) + 10,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setSessionData(prev => [...prev, newSession]);
    setCompletedSessions(prev => prev + 1);
    setTotalStressReduction(prev => prev + 15);
    setShowBreathingCircle(false);
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-[#121212] text-slate-900 dark:text-white pb-24 px-4 sm:px-6 flex flex-col items-center transition-colors duration-300 overflow-x-hidden w-full">
      <div className="w-full max-w-4xl flex items-center pt-8 mb-8 z-10">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/60 dark:bg-white/5 px-4 py-2 rounded-full border border-black/5 dark:border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Back to Levels</span>
        </Link>
      </div>

      <div className="relative text-center mb-12 sm:mb-20 w-full max-w-4xl z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <h1 className="relative text-5xl sm:text-6xl tracking-tight mb-3 font-bold text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md">Calm State</h1>
        <p className="text-pink-600 dark:text-pink-300 font-medium tracking-wide uppercase text-sm">Biofeedback Analysis</p>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center mb-12 z-10">
        <div className="relative mb-12 mt-10 w-full flex flex-col items-center">
          <div className="absolute inset-0 -m-32 sm:-m-40 bg-gradient-to-br from-pink-400/20 to-rose-400/10 dark:from-pink-500/20 dark:to-rose-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
          <div className="absolute inset-0 -m-20 sm:-m-24 bg-gradient-to-br from-pink-400/20 to-rose-400/20 dark:from-pink-500/20 dark:to-rose-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative flex items-center justify-center mb-12">
            <Heart className="w-56 h-56 sm:w-72 sm:h-72 text-pink-500 fill-pink-500 drop-shadow-[0_0_50px_rgba(236,72,153,0.4)] dark:drop-shadow-[0_0_50px_rgba(236,72,153,0.6)]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black text-white drop-shadow-xl tracking-tighter">
                  {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)}
                </div>
                <div className="text-sm sm:text-base text-pink-100 font-medium uppercase tracking-widest mt-2 opacity-90">mmHg</div>
              </div>
            </div>
          </div>

          {!showBreathingCircle ? (
            <button
              onClick={() => setShowBreathingCircle(true)}
              className="relative z-20 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full px-8 py-4 font-bold hover:scale-105 transition-all shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] whitespace-nowrap text-sm tracking-wide"
            >
              START FOURFOLD BREATH
            </button>
          ) : (
            <div className="relative z-20 bg-white/80 dark:bg-blue-950/40 rounded-[2rem] p-6 sm:p-10 border border-blue-200 dark:border-blue-500/20 shadow-2xl max-w-lg w-full backdrop-blur-xl transition-colors duration-300 animate-in zoom-in-95 fade-in duration-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Fourfold Breath Exercise</h3>
                <p className="text-slate-600 dark:text-blue-200">Follow the neon dot's path to regulate your breathing</p>
              </div>
              <BoxBreathingAnimation onComplete={handleSessionComplete} onEarlyEnd={handleEarlyEnd} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mt-4">
          <div className="bg-white/60 dark:bg-white/5 rounded-3xl p-6 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-xl transition-colors duration-300">
            <h3 className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-4">Analysis</h3>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-gray-300">
              Your vitals are <span className="text-green-600 dark:text-green-400 font-semibold drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">doing good</span>.
              Keep maintaining this <span className="text-blue-600 dark:text-blue-400 font-semibold drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">steady</span> pace.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-white/5 rounded-3xl p-6 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-xl transition-colors duration-300">
            <h3 className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-4">Observation</h3>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-gray-300">
              Point of stillness reached. <span className="text-purple-600 dark:text-purple-400 font-semibold drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]">Empty</span> and <span className="text-blue-600 dark:text-blue-400 font-semibold drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">steady</span> state achieved.
            </p>
          </div>
        </div>
      </div>

      {sessionData.length > 0 && (
        <div className="bg-purple-50/80 dark:bg-purple-950/30 rounded-[2rem] p-6 sm:p-8 border border-purple-200 dark:border-purple-500/20 shadow-xl max-w-4xl w-full mb-12 backdrop-blur-md z-10 transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Session History
          </h3>
          <div className="space-y-4">
            {sessionData.slice().reverse().map((session, index) => (
              <div key={index} className="bg-white/60 dark:bg-black/40 rounded-2xl p-5 border border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-4 border-b border-black/5 dark:border-white/10 pb-3">
                  <span className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">Session {sessionData.length - index}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-500">{session.timestamp}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Heart Rate</div>
                    <div className="text-2xl font-black text-green-600 dark:text-green-400">{session.heartRate}</div>
                    <div className="text-xs text-slate-600 dark:text-gray-600 mt-1">bpm</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Respiration</div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{session.respiration}</div>
                    <div className="text-xs text-slate-600 dark:text-gray-600 mt-1">br/min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Stress Level</div>
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{session.stress}</div>
                    <div className="text-xs text-slate-600 dark:text-gray-600 mt-1">low</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/60 dark:bg-white/5 rounded-[2rem] p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-xl max-w-4xl w-full z-10 mb-8 backdrop-blur-md transition-colors duration-300">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Root Cause Suggestions</h3>
        <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-gray-300">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
            <p><span className="text-slate-900 dark:text-white font-semibold block mb-1">Why you are calm:</span> Consistent breathing patterns and low stress indicators detected</p>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
            <p><span className="text-slate-900 dark:text-white font-semibold block mb-1">Positive factors:</span> Heart rate variability is within optimal range</p>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
            <p><span className="text-slate-900 dark:text-white font-semibold block mb-1">Environment:</span> Absence of recent stressors or stimulants</p>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mt-6">
            <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p><span className="text-slate-900 dark:text-white font-semibold block mb-1">Tip:</span> Maintain this state by practicing the Fourfold Breath for 4 minutes daily</p>
          </div>
        </div>
      </div>
    </div>
  );
}
