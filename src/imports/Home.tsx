import { useNavigate } from "react-router";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-6 bg-neutral-950 text-white"
    >
      <div className="text-center mb-12">
        <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-red-500 uppercase">Are You In Danger?</h1>
        <p className="text-neutral-400 text-lg max-w-xs mx-auto">Please select the option that best describes your immediate situation.</p>
      </div>

      <div className="flex flex-col w-full gap-6">
        <button
          onClick={() => navigate("/emergency")}
          className="w-full py-8 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-4xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-900/50 flex items-center justify-center gap-4 border border-red-500/50"
        >
          <AlertTriangle className="w-10 h-10" strokeWidth={3} />
          YES
        </button>
        
        <button
          onClick={() => navigate("/survey")}
          className="w-full py-8 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-300 text-3xl font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-4 border border-neutral-700"
        >
          <ShieldCheck className="w-8 h-8" />
          NO
        </button>
      </div>
    </motion.div>
  );
}
