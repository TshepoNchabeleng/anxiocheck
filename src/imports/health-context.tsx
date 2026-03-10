import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of health data that will be shared across the app
// This interface ensures type safety for all health-related information
interface HealthData {
  heartRate: number; // Current heart rate in beats per minute (BPM)
  spo2: number; // Blood oxygen saturation percentage (SpO2)
  bloodPressure: { systolic: number; diastolic: number }; // Blood pressure readings
  steps: number; // Step counter - increases with activity/heart rate
  showHighBPAlert: boolean; // Flag to display high blood pressure warning
  simulationPhase: 'normal' | 'building' | 'peak' | 'plateau' | 'recovery'; // Current phase of anxiety simulation
  mood: 'calm' | 'slightly-anxious' | 'anxious' | 'recovering'; // User's current mood state based on vitals
  history: Array<{ // Array of historical health readings for tracking and charts
    timestamp: Date; // When the reading was taken
    heartRate: number; // Heart rate at that time
    spo2: number; // SpO2 at that time
    bloodPressure: { systolic: number; diastolic: number }; // Blood pressure at that time
  }>;
}

// Extend HealthData interface to include the resetToCalm function
// This allows any component to trigger a return to calm state
interface HealthContextType extends HealthData {
  resetToCalm: () => void; // Function to initiate recovery phase from anxiety
}

// Create the React Context with undefined as initial value
// Context will be populated by HealthProvider and accessed via useHealth hook
const HealthContext = createContext<HealthContextType | undefined>(undefined);

// HealthProvider component wraps the entire app to provide global health simulation
// This ensures health metrics continue updating regardless of which page user is on
export function HealthProvider({ children }: { children: ReactNode }) {
  // Initialize heart rate at normal resting value (72 BPM)
  const [heartRate, setHeartRate] = useState(72);
  
  // Initialize blood oxygen at healthy level (98%)
  const [spo2, setSpo2] = useState(98);
  
  // Initialize blood pressure at normal range (120/80 mmHg)
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });
  
  // Initialize step counter at zero
  const [steps, setSteps] = useState(0);
  
  // Flag to control display of high blood pressure alert - starts as false
  const [showHighBPAlert, setShowHighBPAlert] = useState(false);
  
  // Track current phase of anxiety simulation - starts in normal resting state
  const [simulationPhase, setSimulationPhase] = useState<'normal' | 'building' | 'peak' | 'plateau' | 'recovery'>('normal');
  
  // Track elapsed time in seconds for phase transitions
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Store historical health data for charts and reports - starts empty
  const [history, setHistory] = useState<Array<{
    timestamp: Date;
    heartRate: number;
    spo2: number;
    bloodPressure: { systolic: number; diastolic: number };
  }>>([]);

  // Determine user's mood based on current heart rate and simulation phase
  // This is used to show appropriate video recommendations
  const getMood = (): 'calm' | 'slightly-anxious' | 'anxious' | 'recovering' => {
    // If in recovery phase, always show recovering mood
    if (simulationPhase === 'recovery') return 'recovering';
    
    // If heart rate is very high (>= 105), user is anxious
    if (heartRate >= 105) return 'anxious';
    
    // If heart rate is elevated (> 90), user is slightly anxious
    if (heartRate > 90) return 'slightly-anxious';
    
    // Otherwise user is calm
    return 'calm';
  };

  // Get current mood state
  const mood = getMood();

  // Function to reset simulation to calm state - called after stress regulation
  // This allows users to recover from anxiety episode after self-assessment
  const resetToCalm = () => {
    setSimulationPhase('recovery'); // Jump to recovery phase
    setElapsedTime(65); // Skip ahead to recovery time point
  };

  // Main simulation effect - runs every 2 seconds to update all health metrics
  // This creates a realistic anxiety episode that builds up, peaks, and recovers
  useEffect(() => {
    // Set interval to update vitals every 2 seconds for smooth transitions
    const interval = setInterval(() => {
      // Increment elapsed time counter
      setElapsedTime((prev) => prev + 1);
      
      // Update heart rate based on current simulation phase
      setHeartRate((prev) => {
        // Variable to store the change to apply to current heart rate
        let change = 0;
        
        // NORMAL PHASE: Resting state with minor fluctuations (70-75 BPM)
        if (simulationPhase === 'normal' && elapsedTime < 10) {
          // Small random fluctuations to simulate natural heart rate variability
          change = Math.random() * 0.5 - 0.25;
          // Keep heart rate within normal resting range
          return Math.max(70, Math.min(75, prev + change));
        } else if (simulationPhase === 'normal' && elapsedTime >= 10) {
          // After 10 seconds of normal state, begin anxiety buildup
          setSimulationPhase('building');
        }
        
        // BUILDING PHASE: Gradual increase from 75 to 105 BPM over ~20 seconds
        if (simulationPhase === 'building') {
          // Consistent upward change with slight randomness
          change = 1.5 + Math.random() * 0.5;
          const newRate = prev + change;
          
          // Show alert immediately when heart rate exceeds normal threshold (100 BPM)
          if (newRate > 100) {
            setShowHighBPAlert(true);
          }
          
          // When heart rate reaches 105, transition to peak anxiety phase
          if (newRate >= 105) {
            setSimulationPhase('peak');
            return 105; // Cap at 105 to prevent overshooting
          }
          return newRate;
        }
        
        // PEAK PHASE: High anxiety with rapid fluctuations (105-112 BPM)
        if (simulationPhase === 'peak') {
          // Larger random fluctuations to simulate panic/anxiety
          change = Math.random() * 3 - 1.5;
          const newRate = Math.max(105, Math.min(112, prev + change));
          
          // Stay at peak for approximately 15 seconds (elapsed time > 45)
          if (elapsedTime > 45) {
            setSimulationPhase('plateau'); // Begin stabilization
          }
          return newRate;
        }
        
        // PLATEAU PHASE: Elevated but stabilizing (95-100 BPM)
        if (simulationPhase === 'plateau') {
          // Push heart rate down if above 100
          if (prev > 100) {
            change = -0.8 + Math.random() * 0.3;
          } else if (prev < 95) {
            // Push up if below 95
            change = 0.5;
          } else {
            // Small fluctuations within plateau range
            change = Math.random() * 0.6 - 0.3;
          }
          
          const newRate = Math.max(95, Math.min(100, prev + change));
          
          // Dismiss alert when heart rate returns to normal range (<= 100)
          if (newRate <= 100) {
            setShowHighBPAlert(false);
          }
          
          // Stay at plateau for approximately 20 seconds (elapsed time > 65)
          if (elapsedTime > 65) {
            setSimulationPhase('recovery'); // Begin recovery to normal
          }
          return newRate;
        }
        
        // RECOVERY PHASE: Gradual return to normal resting heart rate (100 -> 72 BPM)
        if (simulationPhase === 'recovery') {
          // Continue decreasing if above normal resting rate
          if (prev > 72) {
            change = -1.2 + Math.random() * 0.4; // Steady decrease with slight variation
            const newRate = Math.max(72, prev + change);
            
            // Ensure alert is dismissed during recovery
            if (newRate <= 100) {
              setShowHighBPAlert(false);
            }
            
            return newRate;
          } else {
            // Once at resting rate, maintain with small fluctuations
            change = Math.random() * 0.5 - 0.25;
            setShowHighBPAlert(false); // Ensure alert stays dismissed
            
            // Check if enough time has passed in recovery (15 seconds at normal)
            // If so, start a new stress cycle after a calm period
            if (elapsedTime > 95) {
              // Reset cycle: stay calm for a bit, then build up again
              setSimulationPhase('normal');
              setElapsedTime(0); // Reset timer for new cycle
            }
            
            return Math.max(70, Math.min(75, prev + change));
          }
        }
        
        // Default: return current value if no phase matches
        return prev;
      });
      
      // Update SpO2 (blood oxygen) based on current simulation phase
      // SpO2 decreases during anxiety due to rapid breathing/hyperventilation
      setSpo2((prev) => {
        let change = 0;
        
        // NORMAL PHASE: Healthy oxygen levels (97-98%)
        if (simulationPhase === 'normal' && elapsedTime < 10) {
          // Tiny fluctuations within optimal range
          change = Math.random() * 0.2 - 0.1;
          return Math.max(97, Math.min(98.5, prev + change));
        }
        
        // BUILDING PHASE: Slight decrease as anxiety builds (98 -> 94%)
        if (simulationPhase === 'building') {
          // Gradual decline during anxiety buildup
          change = -0.15 - Math.random() * 0.1;
          return Math.max(94, prev + change); // Don't go below 94%
        }
        
        // PEAK PHASE: Lowest point with fluctuations (92-94%)
        if (simulationPhase === 'peak') {
          // Random fluctuations at low level
          change = Math.random() * 0.4 - 0.2;
          return Math.max(92, Math.min(94.5, prev + change));
        }
        
        // PLATEAU PHASE: Beginning to stabilize (93-95%)
        if (simulationPhase === 'plateau') {
          // Push up if too low
          if (prev < 94) {
            change = 0.15 + Math.random() * 0.1;
          } else {
            // Small fluctuations within stabilizing range
            change = Math.random() * 0.3 - 0.15;
          }
          return Math.max(93, Math.min(95.5, prev + change));
        }
        
        // RECOVERY PHASE: Returning to healthy levels (back to 97-98%)
        if (simulationPhase === 'recovery') {
          // Continue increasing if below normal
          if (prev < 97) {
            change = 0.2 + Math.random() * 0.15;
            return Math.min(98, prev + change);
          } else {
            // Maintain at healthy level with small fluctuations
            change = Math.random() * 0.2 - 0.1;
            return Math.max(97, Math.min(98.5, prev + change));
          }
        }
        
        // Default: return current value
        return prev;
      });
      
      // Update blood pressure based on current simulation phase
      // Both systolic and diastolic increase during anxiety
      setBloodPressure((prev) => {
        let systolicChange = 0; // Change for top number (systolic pressure)
        let diastolicChange = 0; // Change for bottom number (diastolic pressure)
        
        // NORMAL PHASE: Normal BP range (115-122 / 75-82 mmHg)
        if (simulationPhase === 'normal' && elapsedTime < 10) {
          // Small random fluctuations within normal range
          systolicChange = Math.random() * 0.5 - 0.25;
          diastolicChange = Math.random() * 0.3 - 0.15;
          return {
            systolic: Math.max(115, Math.min(122, prev.systolic + systolicChange)),
            diastolic: Math.max(75, Math.min(82, prev.diastolic + diastolicChange))
          };
        }
        
        // BUILDING PHASE: Rising BP (120/80 -> 145/95 mmHg)
        if (simulationPhase === 'building') {
          // Consistent upward pressure during anxiety buildup
          systolicChange = 1.2 + Math.random() * 0.5;
          diastolicChange = 0.7 + Math.random() * 0.3;
          return {
            systolic: Math.min(145, prev.systolic + systolicChange), // Cap at 145
            diastolic: Math.min(95, prev.diastolic + diastolicChange) // Cap at 95
          };
        }
        
        // PEAK PHASE: High BP with fluctuations (142-148 / 93-98 mmHg)
        if (simulationPhase === 'peak') {
          // Random fluctuations at elevated level
          systolicChange = Math.random() * 2 - 1;
          diastolicChange = Math.random() * 1.5 - 0.75;
          return {
            systolic: Math.max(142, Math.min(148, prev.systolic + systolicChange)),
            diastolic: Math.max(93, Math.min(98, prev.diastolic + diastolicChange))
          };
        }
        
        // PLATEAU PHASE: Slightly elevated but stabilizing (130-138 / 85-90 mmHg)
        if (simulationPhase === 'plateau') {
          // Push systolic down if too high
          if (prev.systolic > 138) {
            systolicChange = -1 + Math.random() * 0.3;
          } else if (prev.systolic < 130) {
            // Push up if too low
            systolicChange = 0.5;
          } else {
            // Fluctuate within range
            systolicChange = Math.random() * 0.8 - 0.4;
          }
          
          // Similar logic for diastolic
          if (prev.diastolic > 90) {
            diastolicChange = -0.6 + Math.random() * 0.2;
          } else if (prev.diastolic < 85) {
            diastolicChange = 0.3;
          } else {
            diastolicChange = Math.random() * 0.5 - 0.25;
          }
          
          return {
            systolic: Math.max(130, Math.min(138, prev.systolic + systolicChange)),
            diastolic: Math.max(85, Math.min(90, prev.diastolic + diastolicChange))
          };
        }
        
        // RECOVERY PHASE: Returning to normal (back to 118-122 / 76-80 mmHg)
        if (simulationPhase === 'recovery') {
          // Continue decreasing if above normal
          if (prev.systolic > 122) {
            systolicChange = -1.5 + Math.random() * 0.4;
            return {
              systolic: Math.max(118, prev.systolic + systolicChange),
              // Diastolic decreases proportionally (60% of systolic change)
              diastolic: Math.max(76, prev.diastolic + (systolicChange * 0.6))
            };
          } else {
            // Maintain at normal level with small fluctuations
            systolicChange = Math.random() * 0.5 - 0.25;
            diastolicChange = Math.random() * 0.3 - 0.15;
            return {
              systolic: Math.max(118, Math.min(122, prev.systolic + systolicChange)),
              diastolic: Math.max(76, Math.min(80, prev.diastolic + diastolicChange))
            };
          }
        }
        
        // Default: return current value
        return prev;
      });
    }, 2000); // Update every 2 seconds (2000 milliseconds) for smooth transitions

    // Cleanup function to prevent memory leaks
    // Clears interval when component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [simulationPhase, elapsedTime]); // Re-run effect when phase or time changes

  // Separate effect to record health data history every 10 seconds
  // This creates data points for charts and reports without overwhelming storage
  useEffect(() => {
    const historyInterval = setInterval(() => {
      setHistory((prev) => {
        // Create new history entry with current vitals and timestamp
        const newEntry = {
          timestamp: new Date(), // Current date/time
          heartRate: Math.round(heartRate), // Round to whole number for cleaner display
          spo2: Math.round(spo2), // Round to whole number
          bloodPressure: {
            systolic: Math.round(bloodPressure.systolic), // Round systolic
            diastolic: Math.round(bloodPressure.diastolic) // Round diastolic
          }
        };
        // Add new entry and keep only last 50 entries (about 8 minutes of data)
        // This prevents unlimited memory growth while keeping recent history
        return [...prev, newEntry].slice(-50);
      });
    }, 10000); // Record every 10 seconds (10000 milliseconds)

    // Cleanup function to prevent memory leaks
    return () => clearInterval(historyInterval);
  }, [heartRate, spo2, bloodPressure]); // Re-run when any vital changes

  // ========================================
  // STEP COUNTER EFFECT - REACTIVE TO HEART RATE
  // ========================================
  // Updates step count based on heart rate and simulation phase
  // Simulates realistic behavior: more movement = higher heart rate = more steps
  // This demonstrates correlation between physical activity and vitals
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setSteps((prevSteps) => {
        // Calculate step increment based on current heart rate
        // Higher heart rate = more steps added per interval
        // This simulates increased movement during anxiety/stress
        
        let stepsToAdd = 0;
        
        // NORMAL PHASE: Minimal activity (resting/sitting)
        // HR 70-75: Add 0-2 steps per interval (slow passive movement)
        if (heartRate <= 75) {
          stepsToAdd = Math.floor(Math.random() * 3); // 0, 1, or 2 steps
        }
        
        // SLIGHTLY ELEVATED: Light activity (fidgeting, slow walking)
        // HR 76-90: Add 2-5 steps per interval
        else if (heartRate <= 90) {
          stepsToAdd = 2 + Math.floor(Math.random() * 4); // 2-5 steps
        }
        
        // BUILDING PHASE: Moderate activity (pacing, restless movement)
        // HR 91-100: Add 5-10 steps per interval
        else if (heartRate <= 100) {
          stepsToAdd = 5 + Math.floor(Math.random() * 6); // 5-10 steps
        }
        
        // HIGH ANXIETY: Increased pacing and movement
        // HR 101-110: Add 10-15 steps per interval
        else if (heartRate <= 110) {
          stepsToAdd = 10 + Math.floor(Math.random() * 6); // 10-15 steps
        }
        
        // PEAK ANXIETY: Rapid pacing/restless behavior
        // HR > 110: Add 15-20 steps per interval
        else {
          stepsToAdd = 15 + Math.floor(Math.random() * 6); // 15-20 steps
        }
        
        // Add calculated steps to current total
        // Steps only increase, never decrease (accumulates throughout session)
        return prevSteps + stepsToAdd;
      });
    }, 2000); // Update steps every 2 seconds (same as other vitals for synchronization)
    
    // Cleanup function to prevent memory leaks
    return () => clearInterval(stepInterval);
  }, [heartRate]); // Re-run when heart rate changes

  // Provide all health data and functions to child components via Context
  return (
    <HealthContext.Provider
      value={{
        heartRate: Math.round(heartRate), // Current heart rate (rounded to whole number)
        spo2: Math.round(spo2), // Current blood oxygen (rounded to whole number)
        bloodPressure: { 
          systolic: Math.round(bloodPressure.systolic),
          diastolic: Math.round(bloodPressure.diastolic)
        }, // Current blood pressure (rounded to whole numbers)
        steps, // Current step count (already whole number)
        showHighBPAlert, // Whether to show high BP alert
        simulationPhase, // Current phase of simulation
        mood, // Current mood state
        history, // Array of historical readings
        resetToCalm, // Function to initiate recovery
      }}
    >
      {children} {/* Render all child components */}
    </HealthContext.Provider>
  );
}

// Custom hook to access health context from any component
// This provides type-safe access to health data and throws error if used outside provider
export function useHealth() {
  const context = useContext(HealthContext); // Get context value
  
  // Throw error if hook is used outside of HealthProvider
  // This catches developer errors early
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  
  // Return context value for use in component
  return context;
}