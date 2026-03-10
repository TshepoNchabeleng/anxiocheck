import { useState, useEffect, useRef } from "react";

export function BoxBreathingAnimation({ onComplete, onEarlyEnd }: { onComplete: () => void; onEarlyEnd?: (sessionTime: number) => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [progress, setProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  
  const onCompleteRef = useRef(onComplete);
  const onEarlyEndRef = useRef(onEarlyEnd);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onEarlyEndRef.current = onEarlyEnd;
  }, [onEarlyEnd]);
  
  useEffect(() => {
    const durations = { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 4000 };
    const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2'];
    
    let currentPhaseIndex = 0;
    let startTime = Date.now();
    let sessionStartTime = Date.now();
    let animationId: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const sessionElapsed = Date.now() - sessionStartTime;
      setSessionTime(Math.floor(sessionElapsed / 1000));
      
      const currentPhaseDuration = durations[phases[currentPhaseIndex]];
      const phaseProgress = Math.min(elapsed / currentPhaseDuration, 1);
      
      setProgress(phaseProgress);
      
      const squareSize = 240; 
      const centerOffset = squareSize / 2;
      
      let x = 0, y = 0;
      
      if (phases[currentPhaseIndex] === 'inhale') {
        x = -centerOffset + (phaseProgress * squareSize);
        y = -centerOffset;
      } 
      else if (phases[currentPhaseIndex] === 'hold1') {
        x = centerOffset;
        y = -centerOffset + (phaseProgress * squareSize);
      } 
      else if (phases[currentPhaseIndex] === 'exhale') {
        x = centerOffset - (phaseProgress * squareSize);
        y = centerOffset;
      } 
      else if (phases[currentPhaseIndex] === 'hold2') {
        x = -centerOffset;
        y = centerOffset - (phaseProgress * squareSize);
      }
      
      setDotPosition({ x, y });
      
      if (elapsed >= currentPhaseDuration) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        setPhase(phases[currentPhaseIndex]);
        startTime = Date.now();
        
        if (sessionElapsed >= 240000) {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return;
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'INHALE';
      case 'hold1': return 'HOLD';
      case 'exhale': return 'EXHALE';
      case 'hold2': return 'HOLD';
    }
  };
  
  const countdown = Math.ceil((1 - progress) * 4);
  
  return (
    <div className="flex flex-col items-center gap-8 my-10 w-full max-w-sm mx-auto">
      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[240px] h-[240px] border-4 border-blue-400/50 dark:border-blue-500/30 rounded-xl transition-all duration-300"></div>
        </div>
        
        <div
          className="absolute w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.9)] dark:shadow-[0_0_25px_rgba(96,165,250,0.9)]"
          style={{
            transform: `translate(${dotPosition.x}px, ${dotPosition.y}px)`,
            transition: 'transform 0.1s linear',
          }}
        ></div>
        
        <div className="relative z-10 text-center">
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-widest mb-4">{getInstruction()}</div>
          <div className="text-7xl font-light text-blue-600 dark:text-blue-400 drop-shadow-lg">{countdown}</div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-gray-400 font-medium mb-2">
          Session Time: {Math.floor(sessionTime / 60)}:
          {(sessionTime % 60).toString().padStart(2, '0')}
        </p>
        <p className="text-xs text-slate-500 dark:text-gray-500 max-w-xs mx-auto">
          Complete 4 minutes to maximize stress reduction
        </p>
      </div>
      
      <button
        onClick={() => onEarlyEndRef.current?.(sessionTime)}
        className="mt-4 bg-black/5 dark:bg-white/10 text-slate-700 dark:text-white border border-black/10 dark:border-white/20 rounded-full px-8 py-3 hover:bg-black/10 dark:hover:bg-white/20 transition-all font-medium text-sm"
      >
        End Exercise
      </button>
    </div>
  );
}