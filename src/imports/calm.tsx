import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Wind, Heart, Brain, Sparkles, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useHealth } from "../context/health-context";

// ========================================
// CALM & RELAXATION PAGE
// ========================================
// Interactive stress relief and relaxation interface
// Features breathing exercises, meditation timers, and calming visualizations

export default function Calm() {
  const navigate = useNavigate();
  const { heartRate, bloodPressure } = useHealth();
  
  // ========================================
  // BREATHING EXERCISE STATE
  // ========================================
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);
  
  // ========================================
  // MEDITATION TIMER STATE
  // ========================================
  const [meditationTime, setMeditationTime] = useState(0); // seconds
  const [meditationActive, setMeditationActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5); // minutes
  
  // ========================================
  // BREATHING EXERCISE LOGIC
  // ========================================
  // 4-7-8 breathing technique (inhale 4s, hold 7s, exhale 8s)
  useEffect(() => {
    if (!breathingActive) return;
    
    const timings = {
      inhale: 4000,   // 4 seconds
      hold: 7000,     // 7 seconds
      exhale: 8000,   // 8 seconds
      rest: 2000      // 2 seconds between cycles
    };
    
    const timer = setTimeout(() => {
      if (breathPhase === "inhale") {
        setBreathPhase("hold");
      } else if (breathPhase === "hold") {
        setBreathPhase("exhale");
      } else if (breathPhase === "exhale") {
        setBreathPhase("rest");
        setTotalBreaths(prev => prev + 1);
      } else if (breathPhase === "rest") {
        setBreathPhase("inhale");
        setBreathCount(prev => prev + 1);
      }
    }, timings[breathPhase]);
    
    return () => clearTimeout(timer);
  }, [breathingActive, breathPhase]);
  
  // ========================================
  // MEDITATION TIMER LOGIC
  // ========================================
  useEffect(() => {
    if (!meditationActive) return;
    
    const timer = setInterval(() => {
      setMeditationTime(prev => {
        if (prev >= selectedDuration * 60) {
          setMeditationActive(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [meditationActive, selectedDuration]);
  
  // ========================================
  // HELPER FUNCTIONS
  // ========================================
  const startBreathing = () => {
    setBreathingActive(true);
    setBreathPhase("inhale");
    setBreathCount(0);
    setTotalBreaths(0);
  };
  
  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathPhase("inhale");
  };
  
  const startMeditation = () => {
    setMeditationActive(true);
    setMeditationTime(0);
  };
  
  const pauseMeditation = () => {
    setMeditationActive(false);
  };
  
  const resetMeditation = () => {
    setMeditationActive(false);
    setMeditationTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate current stress level based on health metrics
  const calculateStressLevel = () => {
    const bpm = heartRate;
    const systolic = bloodPressure.systolic;
    
    if (bpm > 100 || systolic > 140) return "High";
    if (bpm > 85 || systolic > 130) return "Moderate";
    return "Low";
  };
  
  const stressLevel = calculateStressLevel();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* ========================================
            HEADER WITH BACK BUTTON
            ======================================== */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Calm Space</h1>
            <p className="text-gray-600">Take a moment to relax and restore your peace</p>
          </div>
        </div>
        
        {/* ========================================
            CURRENT STRESS LEVEL INDICATOR
            ======================================== */}
        <Card className="mb-6 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Current Stress Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{stressLevel}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Based on your current vitals: {heartRate} BPM, {bloodPressure.systolic}/{bloodPressure.diastolic} BP
                </p>
              </div>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                stressLevel === "High" ? "bg-red-100" :
                stressLevel === "Moderate" ? "bg-yellow-100" :
                "bg-green-100"
              }`}>
                <Heart className={`w-10 h-10 ${
                  stressLevel === "High" ? "text-red-600" :
                  stressLevel === "Moderate" ? "text-yellow-600" :
                  "text-green-600"
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* ========================================
              BREATHING EXERCISE CARD
              ======================================== */}
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-600" />
                4-7-8 Breathing
              </CardTitle>
              <CardDescription>
                Inhale for 4, hold for 7, exhale for 8 seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Breathing Visualization Circle */}
              <div className="flex items-center justify-center mb-6 h-64">
                <div className="relative">
                  {/* Animated breathing circle */}
                  <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    breathingActive ? (
                      breathPhase === "inhale" ? "bg-blue-200 scale-100" :
                      breathPhase === "hold" ? "bg-blue-300 scale-110" :
                      breathPhase === "exhale" ? "bg-blue-100 scale-90" :
                      "bg-blue-50 scale-85"
                    ) : "bg-gray-100 scale-100"
                  }`}>
                    <div className="text-center">
                      {breathingActive ? (
                        <>
                          <p className="text-2xl font-bold text-gray-800 capitalize mb-2">
                            {breathPhase === "rest" ? "Rest" : breathPhase}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cycle {breathCount + 1}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">Ready</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Breathing Stats */}
              {totalBreaths > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-center text-gray-700">
                    Completed <span className="font-bold">{totalBreaths}</span> breath cycle{totalBreaths !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
              
              {/* Controls */}
              <div className="flex gap-2">
                {!breathingActive ? (
                  <Button onClick={startBreathing} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Breathing
                  </Button>
                ) : (
                  <Button onClick={stopBreathing} variant="outline" className="w-full">
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
              
              {/* Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Benefits:</strong> Reduces anxiety, lowers heart rate, promotes relaxation
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* ========================================
              MEDITATION TIMER CARD
              ======================================== */}
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Meditation Timer
              </CardTitle>
              <CardDescription>
                Set a timer for guided meditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Timer Display */}
              <div className="flex items-center justify-center mb-6 h-64">
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-4 ${
                    meditationActive ? "text-purple-600" : "text-gray-400"
                  }`}>
                    {formatTime(meditationTime)}
                  </div>
                  <p className="text-gray-600">
                    {meditationActive ? "Meditating..." : "Select duration"}
                  </p>
                  {meditationTime >= selectedDuration * 60 && (
                    <p className="text-green-600 font-semibold mt-2">
                      ✓ Session Complete!
                    </p>
                  )}
                </div>
              </div>
              
              {/* Duration Selection */}
              {!meditationActive && meditationTime === 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 10, 15].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setSelectedDuration(mins)}
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          selectedDuration === mins
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <p className="font-semibold">{mins}</p>
                        <p className="text-xs text-gray-600">min</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              {meditationTime > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.min((meditationTime / (selectedDuration * 60)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Controls */}
              <div className="flex gap-2">
                {!meditationActive ? (
                  <>
                    <Button 
                      onClick={startMeditation} 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      disabled={meditationTime >= selectedDuration * 60}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    {meditationTime > 0 && (
                      <Button onClick={resetMeditation} variant="outline">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <Button onClick={pauseMeditation} variant="outline" className="w-full">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
              </div>
              
              {/* Info */}
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Tip:</strong> Find a quiet space, sit comfortably, and focus on your breath
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ========================================
            RELAXATION TIPS SECTION
            ======================================== */}
        <Card className="mt-6 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Quick Relaxation Tips</CardTitle>
            <CardDescription>Simple techniques to reduce stress instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🌊 Progressive Muscle Relaxation</h3>
                <p className="text-sm text-gray-700">
                  Tense each muscle group for 5 seconds, then release. Start from your toes and work up to your head.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🎵 Listen to Calming Music</h3>
                <p className="text-sm text-gray-700">
                  Play soft instrumental music or nature sounds at a low volume to create a peaceful environment.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🖼️ Visualization</h3>
                <p className="text-sm text-gray-700">
                  Close your eyes and imagine yourself in a peaceful place - a beach, forest, or mountain retreat.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">☀️ Mindful Walking</h3>
                <p className="text-sm text-gray-700">
                  Take a slow walk outside and focus on each step, the feeling of the ground, and your surroundings.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">📝 Journaling</h3>
                <p className="text-sm text-gray-700">
                  Write down your thoughts and feelings. This helps process emotions and gain clarity.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🧘 Gentle Stretching</h3>
                <p className="text-sm text-gray-700">
                  Simple stretches release physical tension. Focus on your neck, shoulders, and back.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Remember: Consistent practice brings the best results</p>
          <p className="mt-1">Even 5 minutes of daily relaxation can significantly reduce stress</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   CALM PAGE IMPLEMENTATION NOTES
   ========================================
   
   FEATURES IMPLEMENTED:
   
   1. BREATHING EXERCISE (4-7-8 Technique)
      - Visual animated circle that expands/contracts
      - Automatic phase transitions
      - Cycle counter
      - Start/stop controls
      - Proven technique for anxiety reduction
   
   2. MEDITATION TIMER
      - Customizable duration (3, 5, 10, 15 minutes)
      - Start/pause/reset controls
      - Progress bar visualization
      - Completion notification
      - Clean, distraction-free interface
   
   3. STRESS LEVEL INDICATOR
      - Real-time calculation from health metrics
      - Visual color-coded display
      - Shows current BPM and blood pressure
      - Helps user understand their current state
   
   4. RELAXATION TIPS
      - 6 evidence-based techniques
      - Visual cards with descriptions
      - Diverse methods for different preferences
      - Actionable instructions
   
   DESIGN PHILOSOPHY:
   
   - Soft, calming gradient background
   - Muted pastel colors
   - Ample whitespace
   - Smooth animations
   - Minimal distractions
   - Clear, simple instructions
   
   FUTURE ENHANCEMENTS:
   
   - Add ambient sounds (rain, ocean waves, forest)
   - Guided meditation audio
   - More breathing patterns (box breathing, etc.)
   - Progress tracking over time
   - Mood check-in before/after
   - Integration with health data to show stress reduction
   - Customizable themes/backgrounds
   - Haptic feedback for breathing rhythm (mobile)
   
   ACCESSIBILITY:
   
   - Large, readable text
   - Clear visual indicators
   - Keyboard navigation support
   - Color-blind friendly indicators
   - Screen reader compatible
*/