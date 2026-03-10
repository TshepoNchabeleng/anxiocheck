import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MapPin, PhoneCall, MessageSquare, AlertCircle, CheckCircle2, ArrowLeft, Calculator } from "lucide-react";

export default function Emergency() {
  const [step, setStep] = useState(0);
  const [isDeceptionMode, setIsDeceptionMode] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [location, setLocation] = useState({ lat: 34.0522, lng: -118.2437 });
  const [communicationMode, setCommunicationMode] = useState<"pending" | "voice" | "text">("pending");
  const navigate = useNavigate();

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleCalcClick = (btn: string) => {
    if (btn === 'AC') {
      setCalcDisplay('0');
      setPrevValue(null);
      setOperator(null);
      setWaitingForNewValue(false);
    } else if (btn === '+/-') {
      setCalcDisplay((prev) => (parseFloat(prev) * -1).toString());
    } else if (btn === '%') {
      setCalcDisplay((prev) => (parseFloat(prev) / 100).toString());
    } else if (['+', '-', '×', '÷'].includes(btn)) {
      if (operator && !waitingForNewValue && prevValue !== null) {
        const result = calculate(prevValue, parseFloat(calcDisplay), operator);
        setCalcDisplay(String(parseFloat(result.toPrecision(8))).substring(0, 10));
        setPrevValue(result);
      } else {
        setPrevValue(parseFloat(calcDisplay));
      }
      setOperator(btn);
      setWaitingForNewValue(true);
    } else if (btn === '=') {
      if (operator && prevValue !== null) {
        const result = calculate(prevValue, parseFloat(calcDisplay), operator);
        setCalcDisplay(String(parseFloat(result.toPrecision(8))).substring(0, 10));
        setPrevValue(null);
        setOperator(null);
        setWaitingForNewValue(true);
      }
    } else {
      if (waitingForNewValue) {
        setCalcDisplay(btn === '.' ? '0.' : btn);
        setWaitingForNewValue(false);
      } else {
        if (btn === '.' && calcDisplay.includes('.')) return;
        setCalcDisplay((prev) => 
          prev === '0' && btn !== '.' ? btn : (prev + btn).substring(0, 10)
        );
      }
    }
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 2500); 
    const timer2 = setTimeout(() => setStep(2), 5000); 
    
    const locationInterval = setInterval(() => {
      setLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0005,
        lng: prev.lng + (Math.random() - 0.5) * 0.0005
      }));
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(locationInterval);
    };
  }, []);

  if (isDeceptionMode) {
    return (
      <div className="flex-1 flex flex-col bg-black text-white min-h-screen relative z-50">
        <div className="absolute top-0 left-0 w-full p-4 flex items-center z-10">
          <button 
            onClick={() => setIsDeceptionMode(false)}
            className="p-2 text-neutral-800 hover:text-neutral-600 transition-colors rounded-xl"
            title="Return to emergency"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 p-6 flex flex-col justify-end pb-12">
          <div 
            onClick={() => setIsDeceptionMode(false)}
            className="text-right text-7xl font-light mb-8 truncate cursor-pointer tracking-tighter"
          >
            {calcDisplay}
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {['AC', '+/-', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn) => {
              const isOperator = ['÷', '×', '-', '+', '='].includes(btn);
              const isFunction = ['AC', '+/-', '%'].includes(btn);
              const isZero = btn === '0';
              const isActiveOperator = operator === btn && waitingForNewValue;

              return (
                <button
                  key={btn} 
                  onClick={() => handleCalcClick(btn)} 
                  className={`
                    flex items-center justify-center text-3xl font-normal transition-opacity active:opacity-70
                    ${isZero ? 'col-span-2 rounded-full justify-start pl-8 aspect-auto' : 'aspect-square rounded-full'}
                    ${isOperator 
                        ? (isActiveOperator ? 'bg-white text-[#FF9F0A]' : 'bg-[#FF9F0A] text-white') 
                        : isFunction ? 'bg-[#A5A5A5] text-black' : 'bg-[#333333] text-white'
                    }
                  `}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-red-950 text-white p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 text-red-500 mb-8 border-b border-red-900/50 pb-6 pt-4 relative"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-red-400 hover:bg-red-900/30 rounded-xl transition-colors shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase truncate">Emergency</h2>
        </div>
        <button 
          onClick={() => setIsDeceptionMode(true)}
          title="Disguise Screen"
          className="p-3 -mr-2 text-red-500/40 hover:text-red-400 hover:bg-red-900/30 rounded-xl transition-colors shrink-0"
        >
          <Calculator className="w-6 h-6" />
        </button>
      </motion.div>

      <div className="flex-1 flex flex-col gap-6 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-3xl border-2 ${step >= 1 ? 'bg-red-900/30 border-red-500/50' : 'bg-neutral-900/80 border-neutral-800'} flex items-start gap-4 transition-all duration-500`}
        >
          <div className={`${step >= 1 ? 'text-red-400' : 'text-neutral-500'}`}>
            <MapPin className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1 text-white">Continuous Tracking</h3>
            <p className="text-neutral-400">
              {step >= 1 ? "Live coordinates streaming to dispatch." : "Requesting high-accuracy location data..."}
            </p>
            {step >= 1 && (
              <div className="mt-3 p-2 bg-red-950/50 rounded-lg border border-red-900/50 flex flex-col gap-1">
                <div className="text-xs text-red-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  LAT: {location.lat.toFixed(6)}
                </div>
                <div className="text-xs text-red-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  LNG: {location.lng.toFixed(6)}
                </div>
              </div>
            )}
            {step === 0 && <p className="text-sm text-red-400 mt-3 font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Please ensure Location Services are ON.</p>}
          </div>
          {step >= 1 && <CheckCircle2 className="w-6 h-6 text-red-500" />}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: step >= 1 ? 1 : 0.3, x: step >= 1 ? 0 : -20 }}
          className={`p-6 rounded-3xl border-2 ${step >= 2 ? 'bg-red-900/30 border-red-500/50' : 'bg-neutral-900/80 border-neutral-800'} flex items-start gap-4 transition-all duration-500`}
        >
          <div className={`${step >= 2 ? 'text-red-400' : 'text-neutral-600'}`}>
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-xl mb-1 ${step >= 1 ? 'text-white' : 'text-neutral-600'}`}>Silent Dispatch</h3>
            <p className={`text-sm ${step >= 1 ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {step >= 2 ? "Data packet sent to local dispatch." : "Preparing emergency coordinates payload..."}
            </p>
          </div>
          {step >= 2 && <CheckCircle2 className="w-6 h-6 text-red-500" />}
        </motion.div>

        {step >= 2 && communicationMode === "pending" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-6 rounded-3xl border-2 bg-red-900/40 border-red-500 flex flex-col items-center text-center gap-4 transition-all duration-500 shadow-xl shadow-red-900/50"
          >
            <AlertCircle className="w-12 h-12 text-red-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-xl mb-2 text-white">Safe to speak?</h3>
              <p className="text-red-200 text-sm">Are you in a safe enough space to speak on a call with the police department?</p>
            </div>
            <div className="flex w-full gap-3 mt-2">
              <button 
                onClick={() => {
                  setCommunicationMode("voice");
                  setStep(3);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition-colors"
              >
                Yes, Call Now
              </button>
              <button 
                onClick={() => {
                  setCommunicationMode("text");
                  setStep(3);
                }}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-colors border border-neutral-700"
              >
                No, Use Text
              </button>
            </div>
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-3xl border-2 bg-red-900/30 border-red-500/50 flex items-start gap-4 transition-all duration-500`}
          >
            <div className="text-red-400">
              {communicationMode === "voice" ? (
                <PhoneCall className="w-8 h-8 animate-pulse text-red-400" />
              ) : (
                <MessageSquare className="w-8 h-8 animate-pulse text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1 text-white">
                {communicationMode === "voice" ? "Voice Dispatch" : "Text Dispatch"}
              </h3>
              <p className="text-sm text-neutral-400">
                {communicationMode === "voice" 
                  ? "Direct connection established." 
                  : "Silent text connection established with local dispatch."}
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-red-500" />
          </motion.div>
        )}
      </div>

      {step >= 3 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mt-8 p-8 bg-red-600 rounded-3xl text-center shadow-2xl shadow-red-900/50 border-2 border-red-400"
        >
          <h2 className="text-3xl font-black uppercase tracking-widest mb-3 text-white">Help is on the way.</h2>
          <p className="text-red-100 font-medium text-lg leading-relaxed">
            Please find a safe place immediately. Keep this device with you.
          </p>
        </motion.div>
      )}
    </div>
  );
}