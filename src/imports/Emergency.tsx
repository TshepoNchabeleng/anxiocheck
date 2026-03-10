import { useEffect, useState } from "react"; // Intent: Import React hooks for lifecycle management and local state.
import { useNavigate } from "react-router"; // Intent: Import router navigation to allow users to exit the emergency screen.
import { motion } from "motion/react"; // Intent: Import motion for the springy/smooth animations of emergency steps.
import { MapPin, PhoneCall, MessageSquare, AlertCircle, CheckCircle2, ArrowLeft, Calculator } from "lucide-react"; // Intent: Import relevant icons to visually distinguish each step and button.

export function Emergency() { // Intent: Export the Emergency Protocol component.
  // Intent: State to track the progress of automated agents (0 = init, 1 = location, 2 = dispatch text, 3 = dispatch voice/text established).
  const [step, setStep] = useState(0);
  
  // Intent: State to toggle the "Deception Mode" which replaces the UI with a fake calculator.
  const [isDeceptionMode, setIsDeceptionMode] = useState(false);
  
  // Intent: State to hold the current input display on the fake calculator.
  const [calcDisplay, setCalcDisplay] = useState("0");
  
  // Intent: State to simulate real-time GPS coordinates. Initialized to a default coordinate pair (Los Angeles).
  const [location, setLocation] = useState({ lat: 34.0522, lng: -118.2437 });
  
  // Intent: State to determine the user's preferred communication method ("pending" means waiting for choice, "voice" or "text" once selected).
  const [communicationMode, setCommunicationMode] = useState<"pending" | "voice" | "text">("pending");
  
  const navigate = useNavigate(); // Intent: Initialize router navigation.

  useEffect(() => {
    // Intent: Set up timers to simulate the automated response from background safety agents.
    
    // Intent: After 2.5 seconds, simulate that the geolocation agent has successfully locked onto the device.
    const timer1 = setTimeout(() => setStep(1), 2500); 
    
    // Intent: After 5 seconds, simulate that a silent payload packet has been dispatched to local authorities.
    const timer2 = setTimeout(() => setStep(2), 5000); 
    
    // Intent: Step 3 (Voice/Text dispatch) is now triggered manually by the user, so no timer3 is needed.
    
    // Intent: Set up an interval that runs every 2 seconds to simulate continuous live GPS tracking.
    const locationInterval = setInterval(() => {
      // Intent: Add a small random jitter to the current coordinates to mimic physical movement in real-time.
      setLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0005,
        lng: prev.lng + (Math.random() - 0.5) * 0.0005
      }));
    }, 2000);

    // Intent: Cleanup function to clear timeouts and intervals if the user unmounts/navigates away from this component early.
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(locationInterval);
    };
  }, []); // Intent: Empty dependency array ensures this effect runs exactly once when the component mounts.

  // Intent: If the user activated deception mode, render ONLY the calculator disguise screen.
  if (isDeceptionMode) {
    return (
      // Intent: Full-screen container styled like a standard dark-mode phone calculator.
      <div className="flex-1 flex flex-col bg-black text-white min-h-0 relative z-50">
        {/* Intent: Subtle, almost invisible back button blending into the black background to allow safe exit. */}
        <div className="absolute top-0 left-0 w-full p-4 flex items-center z-10">
          <button 
            onClick={() => setIsDeceptionMode(false)}
            className="p-2 text-neutral-800 hover:text-neutral-600 transition-colors rounded-xl"
            title="Return to emergency"
          >
            <ArrowLeft className="w-6 h-6" /> {/* Intent: Use ArrowLeft icon for exit. */}
          </button>
        </div>
        
        {/* Intent: Calculator layout container aligned to the bottom. */}
        <div className="flex-1 p-6 flex flex-col justify-end pb-12">
          {/* Intent: Display the calculator number. Also acts as a secret tap target to exit deception mode. */}
          <div 
            onClick={() => setIsDeceptionMode(false)}
            className="text-right text-7xl font-light mb-8 truncate cursor-pointer tracking-tighter"
          >
            {calcDisplay}
          </div>
          
          {/* Intent: Grid of calculator buttons (4 columns). */}
          <div className="grid grid-cols-4 gap-4">
            {/* Intent: Map over a predefined array of typical calculator button labels. */}
            {['AC', '+/-', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn) => {
              // Intent: Function to handle when the user actually tries to type on the fake calculator.
              const handleBtnClick = () => {
                if (btn === 'AC') setCalcDisplay('0'); // Intent: Reset display to 0 on "AC".
                else if (['+/-', '%', '÷', '×', '-', '+', '='].includes(btn)) return; // Intent: Ignore math operators for this mock UI to keep it simple.
                else {
                  // Intent: Append numbers to the display up to a maximum length of 9 characters.
                  setCalcDisplay(prev => prev === '0' && btn !== '.' ? btn : (prev + btn).substring(0, 9));
                }
              };
              
              // Intent: Identify button types to style them differently (Orange for operators, Gray for functions, Dark Gray for numbers).
              const isOperator = ['÷', '×', '-', '+', '='].includes(btn);
              const isFunction = ['AC', '+/-', '%'].includes(btn);
              const isZero = btn === '0'; // Intent: '0' needs to span 2 columns like a real iOS calculator.

              return (
                <button
                  key={btn} 
                  onClick={handleBtnClick} 
                  className={`
                    flex items-center justify-center text-3xl font-normal transition-opacity active:opacity-70
                    ${isZero ? 'col-span-2 rounded-full justify-start pl-8 aspect-auto' : 'aspect-square rounded-full'}
                    ${isOperator ? 'bg-[#FF9F0A] text-white' : isFunction ? 'bg-[#A5A5A5] text-black' : 'bg-[#333333] text-white'}
                  `}
                >
                  {btn} {/* Intent: Render the button label. */}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Intent: Standard Emergency UI. Rendered if deception mode is false.
  return (
    // Intent: Red-themed wrapper to signal urgency/danger, taking up full flex space.
    <div className="flex-1 flex flex-col bg-red-950 text-white p-6 overflow-y-auto min-h-0">
      
      {/* Intent: Animated header dropping in from the top. */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 text-red-500 mb-8 border-b border-red-900/50 pb-6 pt-4 relative"
      >
        {/* Intent: Back button allowing user to leave the emergency state if it was a false alarm. */}
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-red-400 hover:bg-red-900/30 rounded-xl transition-colors shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        {/* Intent: Title area with a pulsing alert icon. */}
        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase truncate">Emergency</h2>
        </div>
        {/* Intent: The crucial Deception Tool trigger button, disguised as a faded calculator icon. */}
        <button 
          onClick={() => setIsDeceptionMode(true)}
          title="Disguise Screen"
          className="p-3 -mr-2 text-red-500/40 hover:text-red-400 hover:bg-red-900/30 rounded-xl transition-colors shrink-0"
        >
          <Calculator className="w-6 h-6" />
        </button>
      </motion.div>

      <div className="flex-1 flex flex-col gap-6 relative">
        {/* Intent: Step 1 Card - Continuous Geolocation Tracking */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-3xl border-2 ${step >= 1 ? 'bg-red-900/30 border-red-500/50' : 'bg-neutral-900/80 border-neutral-800'} flex items-start gap-4 transition-all duration-500`}
        >
          {/* Intent: Map pin icon indicating location services. */}
          <div className={`${step >= 1 ? 'text-red-400' : 'text-neutral-500'}`}>
            <MapPin className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1 text-white">Continuous Tracking</h3>
            <p className="text-neutral-400">
              {/* Intent: Dynamic text based on step status. */}
              {step >= 1 ? "Live coordinates streaming to dispatch." : "Requesting high-accuracy location data..."}
            </p>
            {/* Intent: If location is acquired (step >= 1), display the live, fluctuating GPS coordinates. */}
            {step >= 1 && (
              <div className="mt-3 p-2 bg-red-950/50 rounded-lg border border-red-900/50 flex flex-col gap-1">
                <div className="text-xs text-red-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  LAT: {location.lat.toFixed(6)} {/* Intent: Format latitude to 6 decimal places. */}
                </div>
                <div className="text-xs text-red-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  LNG: {location.lng.toFixed(6)} {/* Intent: Format longitude to 6 decimal places. */}
                </div>
              </div>
            )}
            {/* Intent: Warning prompt shown before location is found to prompt the user to enable GPS. */}
            {step === 0 && <p className="text-sm text-red-400 mt-3 font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Please ensure Location Services are ON.</p>}
          </div>
          {/* Intent: Green checkmark shown when the step is complete. */}
          {step >= 1 && <CheckCircle2 className="w-6 h-6 text-red-500" />}
        </motion.div>

        {/* Intent: Step 2 Card - Silent Message Dispatch */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: step >= 1 ? 1 : 0.3, x: step >= 1 ? 0 : -20 }}
          className={`p-6 rounded-3xl border-2 ${step >= 2 ? 'bg-red-900/30 border-red-500/50' : 'bg-neutral-900/80 border-neutral-800'} flex items-start gap-4 transition-all duration-500`}
        >
          {/* Intent: Message icon to indicate dispatch communication. */}
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

        {/* Intent: Step 3 Decision Point - Ask user if it's safe to speak on voice call. */}
        {/* Intent: Only shown if step 2 is done and the user hasn't made a choice yet. */}
        {step >= 2 && communicationMode === "pending" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-6 rounded-3xl border-2 bg-red-900/40 border-red-500 flex flex-col items-center text-center gap-4 transition-all duration-500 shadow-xl shadow-red-900/50"
          >
            <AlertCircle className="w-12 h-12 text-red-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-xl mb-2 text-white">Safe to speak?</h3>
              {/* Intent: Provide critical context to the user so they know they have options if hiding. */}
              <p className="text-red-200 text-sm">Are you in a safe enough space to speak on a call with the police department?</p>
            </div>
            <div className="flex w-full gap-3 mt-2">
              {/* Intent: Button to trigger voice mode and advance to step 3. */}
              <button 
                onClick={() => {
                  setCommunicationMode("voice");
                  setStep(3);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition-colors"
              >
                Yes, Call Now
              </button>
              {/* Intent: Button to trigger text mode to ensure physical safety in stealth scenarios. */}
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

        {/* Intent: Final Step 3 Status - Display the result of the communication mode decision. */}
        {step >= 3 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-3xl border-2 bg-red-900/30 border-red-500/50 flex items-start gap-4 transition-all duration-500`}
          >
            <div className="text-red-400">
              {/* Intent: Show a phone icon for voice, message icon for text. */}
              {communicationMode === "voice" ? (
                <PhoneCall className="w-8 h-8 animate-pulse text-red-400" />
              ) : (
                <MessageSquare className="w-8 h-8 animate-pulse text-red-400" />
              )}
            </div>
            <div className="flex-1">
              {/* Intent: Display appropriate header text based on user selection. */}
              <h3 className="font-bold text-xl mb-1 text-white">
                {communicationMode === "voice" ? "Voice Dispatch" : "Text Dispatch"}
              </h3>
              {/* Intent: Display appropriate sub-text explaining the status of the connection. */}
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

      {/* Intent: Final reassurance block showing that help has been summoned. */}
      {step >= 3 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mt-8 p-8 bg-red-600 rounded-3xl text-center shadow-2xl shadow-red-900/50 border-2 border-red-400"
        >
          <h2 className="text-3xl font-black uppercase tracking-widest mb-3 text-white">Help is on the way.</h2>
          {/* Intent: Directive command telling the user what to do next to stay safe. */}
          <p className="text-red-100 font-medium text-lg leading-relaxed">
            Please find a safe place immediately. Keep this device with you.
          </p>
        </motion.div>
      )}
    </div>
  );
}
