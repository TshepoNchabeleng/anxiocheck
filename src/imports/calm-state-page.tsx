// Import routing functionality from react-router for navigation
import { Link } from "react-router";
// Import Heart and ArrowLeft icons from lucide-react icon library
import { Heart, ArrowLeft } from "lucide-react";
// Import React hooks for state management and side effects
import { useState, useEffect } from "react";

/**
 * BoxBreathingAnimation Component
 * Renders an animated square box breathing exercise with a traveling neon dot
 * @param onComplete - Callback function triggered when user completes full 4-minute session
 * @param onEarlyEnd - Optional callback function triggered when user ends session early, receives session time in seconds
 */
function BoxBreathingAnimation({ onComplete, onEarlyEnd }: { onComplete: () => void; onEarlyEnd?: (sessionTime: number) => void }) {
  // State: Current breathing phase (inhale, first hold, exhale, second hold)
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  // State: Progress through current phase (0 to 1 representing 0% to 100%)
  const [progress, setProgress] = useState(0);
  // State: Total time elapsed in the session (in seconds)
  const [sessionTime, setSessionTime] = useState(0);
  // State: Current x,y position of the traveling dot on the square path
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  
  // Effect: Runs animation loop for breathing exercise
  useEffect(() => {
    // Define duration for each breathing phase (4 seconds = 4000 milliseconds)
    const durations = { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 4000 };
    // Array of phase names in sequence order
    const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2'];
    
    // Track which phase we're currently in (0=inhale, 1=hold1, 2=exhale, 3=hold2)
    let currentPhaseIndex = 0;
    // Record when current phase started (for calculating elapsed time)
    let startTime = Date.now();
    // Record when entire session started (for total session time tracking)
    let sessionStartTime = Date.now();
    
    // Main animation loop function - called repeatedly via requestAnimationFrame
    const animate = () => {
      // Calculate milliseconds elapsed since current phase started
      const elapsed = Date.now() - startTime;
      // Calculate total milliseconds elapsed since session started
      const sessionElapsed = Date.now() - sessionStartTime;
      // Convert session elapsed time from milliseconds to seconds and update state
      setSessionTime(Math.floor(sessionElapsed / 1000));
      
      // Get the duration of the current phase (4000ms)
      const currentPhaseDuration = durations[phases[currentPhaseIndex]];
      // Calculate progress through current phase (0 to 1), capped at 1 with Math.min
      const phaseProgress = Math.min(elapsed / currentPhaseDuration, 1);
      
      // Update progress state for countdown display
      setProgress(phaseProgress);
      
      // Calculate position of the neon dot on the square border path
      const squareSize = 200; // Total size of the square in pixels
      const centerOffset = squareSize / 2; // Distance from center to edge (100px)
      
      // Initialize x and y coordinates for the dot
      let x = 0, y = 0;
      
      // INHALE PHASE: Dot travels along top edge from left to right
      if (phases[currentPhaseIndex] === 'inhale') {
        // Start at left edge (-100px) and move right based on progress
        x = -centerOffset + (phaseProgress * squareSize);
        // Stay at top edge
        y = -centerOffset;
      } 
      // FIRST HOLD PHASE: Dot travels down right edge from top to bottom
      else if (phases[currentPhaseIndex] === 'hold1') {
        // Stay at right edge
        x = centerOffset;
        // Start at top edge (-100px) and move down based on progress
        y = -centerOffset + (phaseProgress * squareSize);
      } 
      // EXHALE PHASE: Dot travels along bottom edge from right to left
      else if (phases[currentPhaseIndex] === 'exhale') {
        // Start at right edge (100px) and move left based on progress
        x = centerOffset - (phaseProgress * squareSize);
        // Stay at bottom edge
        y = centerOffset;
      } 
      // SECOND HOLD PHASE: Dot travels up left edge from bottom to top
      else if (phases[currentPhaseIndex] === 'hold2') {
        // Stay at left edge
        x = -centerOffset;
        // Start at bottom edge (100px) and move up based on progress
        y = centerOffset - (phaseProgress * squareSize);
      }
      
      // Update dot position state to trigger re-render
      setDotPosition({ x, y });
      
      // Check if current phase is complete
      if (elapsed >= currentPhaseDuration) {
        // Move to next phase, wrapping back to 0 after last phase using modulo operator
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        // Update phase state to trigger UI updates
        setPhase(phases[currentPhaseIndex]);
        // Reset start time for new phase
        startTime = Date.now();
        
        // Check if full 4-minute session is complete (240,000 milliseconds = 4 minutes)
        if (sessionElapsed >= 240000) {
          // Trigger completion callback
          onComplete();
        }
      }
      
      // Schedule next animation frame - creates smooth 60fps animation loop
      requestAnimationFrame(animate);
    };
    
    // Start the animation loop
    const animationId = requestAnimationFrame(animate);
    // Cleanup function: Cancel animation when component unmounts to prevent memory leaks
    return () => cancelAnimationFrame(animationId);
  }, [onComplete]); // Re-run effect if onComplete callback changes
  
  /**
   * Get user-friendly instruction text based on current breathing phase
   * @returns String instruction (INHALE, HOLD, EXHALE)
   */
  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'INHALE';
      case 'hold1': return 'HOLD';
      case 'exhale': return 'EXHALE';
      case 'hold2': return 'HOLD';
    }
  };
  
  // Calculate countdown number (4, 3, 2, 1) based on remaining progress in current phase
  // (1 - progress) gives remaining percentage, multiply by 4 seconds, ceil rounds up
  const countdown = Math.ceil((1 - progress) * 4);
  
  return (
    // Main container: Flexbox column layout with vertical centering and spacing
    <div className="flex flex-col items-center gap-6 my-8">
      {/* Animation container: 320px square with relative positioning for absolute children */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Square breathing guide border container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Blue square border (256px) that guides the user's visual focus */}
          <div 
            className="w-64 h-64 border-4 border-blue-400 transition-all duration-300"
          ></div>
        </div>
        
        {/* Neon-blue dot that travels along the square path */}
        <div
          className="absolute w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
          style={{
            // Transform property dynamically positions dot based on calculated x,y coordinates
            transform: `translate(${dotPosition.x}px, ${dotPosition.y}px)`,
            // Smooth linear transition between positions for fluid motion
            transition: 'transform 0.1s linear',
          }}
        ></div>
        
        {/* Center instruction text overlaid on square */}
        <div className="relative z-10 text-center">
          {/* Large breathing instruction (INHALE, HOLD, EXHALE) */}
          <div className="text-4xl font-bold text-gray-900 mb-4">{getInstruction()}</div>
          {/* Extra large countdown number (4, 3, 2, 1) */}
          <div className="text-6xl font-light text-blue-600">{countdown}</div>
        </div>
      </div>
      
      {/* Session time display container */}
      <div className="text-center">
        {/* Display elapsed time in MM:SS format */}
        <p className="text-sm text-gray-600 mb-2">
          {/* Calculate minutes by dividing sessionTime by 60 and flooring */}
          Session Time: {Math.floor(sessionTime / 60)}:
          {/* Calculate seconds using modulo 60, pad with leading zero if needed */}
          {(sessionTime % 60).toString().padStart(2, '0')}
        </p>
        {/* Motivational text encouraging 4-minute completion */}
        <p className="text-xs text-gray-500 max-w-xs">
          Complete 4 minutes to maximize stress reduction
        </p>
      </div>
      
      {/* Early end button - allows users to save progress even if not completing full 4 minutes */}
      <button
        // Optional chaining (?.) safely calls onEarlyEnd only if it exists, passes current session time
        onClick={() => onEarlyEnd?.(sessionTime)}
        className="w-full mt-4 bg-gray-200 text-gray-700 rounded-full px-6 py-3 hover:bg-gray-300 transition-all"
      >
        End Exercise & Save Progress
      </button>
    </div>
  );
}

/**
 * CalmStatePage Component
 * Main page component for displaying calm state with heart visualization,
 * breathing exercises, and session tracking
 */
export function CalmStatePage() {
  // State: Total number of completed breathing sessions
  const [completedSessions, setCompletedSessions] = useState(0);
  // State: Cumulative stress reduction points earned across all sessions
  const [totalStressReduction, setTotalStressReduction] = useState(0);
  // State: Boolean flag to show/hide breathing exercise UI
  const [showBreathingCircle, setShowBreathingCircle] = useState(false);
  // State: Array storing data from each completed session (heart rate, respiration, stress, timestamp)
  const [sessionData, setSessionData] = useState<Array<{
    heartRate: number;
    respiration: number;
    stress: number;
    timestamp: string;
  }>>([]);

  /**
   * Handler for when user completes full 4-minute breathing session
   * Generates random health metrics and updates session tracking
   */
  const handleSessionComplete = () => {
    // Create new session object with randomized health data
    const newSession = {
      // Random heart rate between 65-75 bpm (lower range after breathing exercise)
      heartRate: Math.floor(Math.random() * 10) + 65,
      // Random respiration rate between 12-15 breaths per minute
      respiration: Math.floor(Math.random() * 3) + 12,
      // Random stress level between 10-30 (lower range indicating relaxation)
      stress: Math.floor(Math.random() * 20) + 10,
      // Current time as HH:MM:SS AM/PM string
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add new session to beginning of sessionData array (spread operator keeps existing data)
    setSessionData(prev => [...prev, newSession]);
    // Increment completed sessions counter
    setCompletedSessions(prev => prev + 1);
    // Add 15 points to total stress reduction score
    setTotalStressReduction(prev => prev + 15);
    // Hide breathing exercise UI after completion
    setShowBreathingCircle(false);
  };

  /**
   * Handler for when user ends breathing session early (before 4 minutes)
   * Records session data even for partial completion to encourage consistency
   * @param sessionTime - Duration of session in seconds (currently unused but available for future features)
   */
  const handleEarlyEnd = (sessionTime: number) => {
    // Create new session object with same randomized health data as full completion
    const newSession = {
      // Random heart rate between 65-75 bpm
      heartRate: Math.floor(Math.random() * 10) + 65,
      // Random respiration rate between 12-15 breaths per minute
      respiration: Math.floor(Math.random() * 3) + 12,
      // Random stress level between 10-30
      stress: Math.floor(Math.random() * 20) + 10,
      // Current time as HH:MM:SS AM/PM string
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add session to data array (same behavior as full completion)
    setSessionData(prev => [...prev, newSession]);
    // Increment sessions counter (partial sessions count toward total)
    setCompletedSessions(prev => prev + 1);
    // Award full 15 points even for early completion (encourages usage)
    setTotalStressReduction(prev => prev + 15);
    // Hide breathing exercise UI
    setShowBreathingCircle(false);
  };

  return (
    // Main page container: Full screen height, white background, dark gray text, bottom padding
    <div className="min-h-screen bg-white text-gray-900 pb-6 px-4 sm:px-6 flex flex-col">
      {/* Back navigation button - Links to Levels page (home route) */}
      <Link 
        to="/" 
        className="mt-6 mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
      >
        {/* Left arrow icon (16px) */}
        <ArrowLeft className="w-4 h-4" />
        Back to Levels
      </Link>

      {/* Page header section with glassmorphism bubble effect */}
      <div className="relative text-center mb-8 sm:mb-12 pt-4">
        {/* Decorative blurred circle background element for glass effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
        {/* Main page title - "Calm State" - Large responsive text */}
        <h1 className="relative text-4xl sm:text-5xl tracking-tight mb-2 text-gray-900">Calm State</h1>
        {/* Subtitle indicating current state */}
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Relaxed</p>
      </div>

      {/* Central hero section featuring large pink heart with BP reading */}
      <div className="flex-1 flex flex-col items-center justify-center mb-8 sm:mb-12">
        <div className="relative">
          {/* Outermost glow ring - largest blur effect with pink gradient and pulse animation */}
          <div className="absolute inset-0 -m-32 sm:-m-40 bg-gradient-to-br from-pink-300/30 to-rose-300/20 rounded-full blur-[100px] animate-pulse"></div>
          {/* Middle glow ring - medium blur with stronger pink tones */}
          <div className="absolute inset-0 -m-24 sm:-m-32 bg-gradient-to-br from-pink-400/40 to-rose-400/30 rounded-full blur-[80px]"></div>
          {/* Inner glow ring - smallest blur, closest to heart */}
          <div className="absolute inset-0 -m-16 sm:-m-20 bg-gradient-to-br from-pink-300/30 to-rose-300/20 rounded-full blur-[60px]"></div>
          
          {/* Heart icon and BP reading container */}
          <div className="relative">
            {/* Large solid pink heart icon - responsive sizing from mobile to desktop */}
            <Heart className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 text-pink-500 fill-pink-500 drop-shadow-2xl" />
            
            {/* Blood pressure reading overlaid on heart center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {/* Large BP numbers (systolic/diastolic) - 118/76 mmHg */}
                <div className="text-5xl sm:text-6xl md:text-7xl text-white drop-shadow-lg">118/76</div>
                {/* Unit label (millimeters of mercury) */}
                <div className="text-base sm:text-lg md:text-xl text-white/90 mt-2">mmHg</div>
              </div>
            </div>
          </div>

          {/* Start breathing button - Only shown when breathing exercise is not active */}
          {!showBreathingCircle && (
            <button
              // Toggle breathing exercise visibility when clicked
              onClick={() => setShowBreathingCircle(true)}
              // Positioned below heart, centered horizontally using transform
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full px-8 py-3 text-sm font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
            >
              Start Fourfold Breath
            </button>
          )}
        </div>

        {/* Motivational comment cards - 2-column grid on larger screens, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-20 sm:mt-24 w-full max-w-3xl">
          {/* First comment card - "Vitals doing good" message */}
          <div className="bg-white/80 rounded-2xl p-4 sm:p-6 border border-gray-200">
            {/* Card label */}
            <h3 className="text-xs sm:text-sm text-gray-600 mb-3">Comment:</h3>
            {/* Message with color-coded keywords */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-800">
              Your vitals are{" "}
              {/* Green highlight for positive word */}
              <span className="text-green-600 font-medium">doing good</span>.
              Keep maintaining this{" "}
              {/* Blue highlight for stability word */}
              <span className="text-blue-600 font-medium">steady</span> pace.
            </p>
          </div>

          {/* Second comment card - "Point of stillness" message */}
          <div className="bg-white/80 rounded-2xl p-4 sm:p-6 border border-gray-200">
            {/* Card label */}
            <h3 className="text-xs sm:text-sm text-gray-600 mb-3">Comment:</h3>
            {/* Message with color-coded keywords */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-800">
              Point of stillness reached.{" "}
              {/* Purple highlight for meditative word */}
              <span className="text-purple-600 font-medium">Empty</span> and{" "}
              {/* Blue highlight for stability word */}
              <span className="text-blue-500 font-medium">steady</span> state achieved.
            </p>
          </div>
        </div>
      </div>

      {/* Breathing exercise panel - Only shown when user clicks "Start Fourfold Breath" */}
      {showBreathingCircle && (
        // Glassmorphism card with blue tint
        <div className="backdrop-blur-xl bg-blue-50/50 rounded-3xl p-4 sm:p-6 border border-blue-200/50 shadow-sm max-w-4xl mx-auto w-full mb-6">
          {/* Exercise title */}
          <h3 className="text-lg sm:text-xl mb-2 text-gray-900">Fourfold Breath Exercise</h3>
          {/* Instruction text */}
          <p className="text-sm text-gray-600 mb-4">Follow the neon dot's path to regulate your breathing</p>
          {/* Render breathing animation component with completion and early-end handlers */}
          <BoxBreathingAnimation onComplete={handleSessionComplete} onEarlyEnd={handleEarlyEnd} />
        </div>
      )}

      {/* Session results panel - Only shown when at least one session has been completed */}
      {sessionData.length > 0 && (
        // Glassmorphism card with purple tint
        <div className="backdrop-blur-xl bg-purple-50/50 rounded-3xl p-4 sm:p-6 border border-purple-200/50 shadow-sm max-w-4xl mx-auto w-full mb-6">
          {/* Results section title */}
          <h3 className="text-lg sm:text-xl mb-4 text-gray-900">Session Results</h3>
          {/* List of session cards with vertical spacing */}
          <div className="space-y-4">
            {/* Reverse array to show newest sessions first, map each session to a card */}
            {sessionData.slice().reverse().map((session, index) => (
              <div key={index} className="bg-white/60 rounded-xl p-4 border border-purple-200">
                {/* Session header with number and timestamp */}
                <div className="flex justify-between items-center mb-3">
                  {/* Calculate session number (counting from 1, newest first) */}
                  <span className="text-sm font-semibold text-gray-700">Session {sessionData.length - index}</span>
                  {/* Display time session was completed */}
                  <span className="text-xs text-gray-500">{session.timestamp}</span>
                </div>
                {/* Three-column grid for health metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Heart Rate metric card */}
                  <div className="text-center">
                    {/* Metric label */}
                    <div className="text-xs text-gray-600 mb-1">Heart Rate</div>
                    {/* Large numeric value in green */}
                    <div className="text-2xl font-bold text-green-700">{session.heartRate}</div>
                    {/* Unit label */}
                    <div className="text-xs text-gray-500">bpm</div>
                  </div>
                  {/* Respiration metric card */}
                  <div className="text-center">
                    {/* Metric label */}
                    <div className="text-xs text-gray-600 mb-1">Respiration</div>
                    {/* Large numeric value in blue */}
                    <div className="text-2xl font-bold text-blue-700">{session.respiration}</div>
                    {/* Unit label (breaths per minute) */}
                    <div className="text-xs text-gray-500">br/min</div>
                  </div>
                  {/* Stress Level metric card */}
                  <div className="text-center">
                    {/* Metric label */}
                    <div className="text-xs text-gray-600 mb-1">Stress Level</div>
                    {/* Large numeric value in purple */}
                    <div className="text-2xl font-bold text-purple-700">{session.stress}</div>
                    {/* Qualitative label */}
                    <div className="text-xs text-gray-500">low</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions panel - Root cause analysis and recommendations */}
      <div className="backdrop-blur-xl bg-blue-50/50 rounded-3xl p-4 sm:p-6 border border-blue-200/50 shadow-sm max-w-4xl mx-auto w-full">
        {/* Section title */}
        <h3 className="text-lg sm:text-xl mb-4 text-gray-900">Suggestions:</h3>
        {/* List of suggestions with vertical spacing */}
        <div className="space-y-3 text-sm sm:text-base text-gray-700">
          {/* Suggestion 1: Why user is calm - with green checkmark */}
          <div className="flex items-start gap-3">
            {/* Green checkmark icon, aligned to top, won't shrink */}
            <span className="text-green-600 mt-1 flex-shrink-0">✓</span>
            {/* Suggestion text with bold prefix */}
            <p><span className="text-gray-900">Why you are calm:</span> Consistent breathing patterns and low stress indicators detected</p>
          </div>
          {/* Suggestion 2: Positive factors - with green checkmark */}
          <div className="flex items-start gap-3">
            <span className="text-green-600 mt-1 flex-shrink-0">✓</span>
            <p><span className="text-gray-900">Positive factors:</span> Heart rate variability is within optimal range</p>
          </div>
          {/* Suggestion 3: Environmental factors - with green checkmark */}
          <div className="flex items-start gap-3">
            <span className="text-green-600 mt-1 flex-shrink-0">✓</span>
            <p><span className="text-gray-900">Environment:</span> Absence of recent stressors or stimulants (caffeine, nicotine)</p>
          </div>
          {/* Tip 1: Daily practice recommendation - with blue bullet point */}
          <div className="flex items-start gap-3">
            {/* Blue bullet point for tips (not checkmarks) */}
            <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
            <p><span className="text-gray-900">Tip:</span> Maintain this state by practicing the Fourfold Breath for 4 minutes daily</p>
          </div>
          {/* Tip 2: Sleep tracking recommendation - with blue bullet point */}
          <div className="flex items-start gap-3">
            <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
            <p><span className="text-gray-900">Recommendation:</span> Consider tracking sleep quality to sustain relaxation levels</p>
          </div>
        </div>
      </div>

      {/* Additional health stats panel - Three-column grid showing key metrics */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-4xl mx-auto w-full">
        {/* Blood Pressure stat card */}
        <div className="backdrop-blur-xl bg-blue-50/50 rounded-2xl p-3 sm:p-4 border border-blue-200/50 shadow-sm text-center">
          {/* Metric label */}
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Blood Pressure</div>
          {/* Large BP reading */}
          <div className="text-lg sm:text-2xl text-gray-900">118/76</div>
          {/* Status indicator - green for optimal */}
          <div className="text-xs text-green-600 mt-1">Optimal</div>
        </div>
        
        {/* Heart Rate stat card */}
        <div className="backdrop-blur-xl bg-blue-50/50 rounded-2xl p-3 sm:p-4 border border-blue-200/50 shadow-sm text-center">
          {/* Metric label */}
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Heart Rate</div>
          {/* Large HR value with unit */}
          <div className="text-lg sm:text-2xl text-gray-900">88 bpm</div>
          {/* Status indicator - green for normal */}
          <div className="text-xs text-green-600 mt-1">Normal</div>
        </div>
        
        {/* Stress Level stat card */}
        <div className="backdrop-blur-xl bg-blue-50/50 rounded-2xl p-3 sm:p-4 border border-blue-200/50 shadow-sm text-center">
          {/* Metric label */}
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Stress Level</div>
          {/* Large qualitative stress value */}
          <div className="text-lg sm:text-2xl text-gray-900">Low</div>
          {/* Status indicator - green for relaxed */}
          <div className="text-xs text-green-600 mt-1">Relaxed</div>
        </div>
      </div>

      {/* Performance summary panel - Garmin-style tracking - Only shown when sessions completed */}
      {completedSessions > 0 && (
        // Green gradient card with stronger border to highlight achievements
        <div className="backdrop-blur-xl bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-4 sm:p-6 border-2 border-green-300 shadow-sm max-w-4xl mx-auto w-full mt-6 sm:mt-8">
          {/* Section title with trophy emoji */}
          <h3 className="text-lg sm:text-xl mb-3 text-gray-900 flex items-center gap-2">
            {/* Trophy emoji for achievement feel */}
            <span className="text-2xl">🏆</span> Performance Summary
          </h3>
          {/* Two-column grid for key performance metrics */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total sessions completed counter */}
            <div>
              {/* Metric label */}
              <p className="text-sm text-gray-600">Completed Sessions</p>
              {/* Large bold number in green */}
              <p className="text-3xl font-bold text-green-700">{completedSessions}</p>
            </div>
            {/* Total stress reduction points earned */}
            <div>
              {/* Metric label */}
              <p className="text-sm text-gray-600">Total Stress Reduction</p>
              {/* Large bold number with minus sign, in green */}
              <p className="text-3xl font-bold text-green-700">-{totalStressReduction} pts</p>
            </div>
          </div>
          {/* Latest session summary card */}
          <div className="mt-4 p-3 bg-white/60 rounded-xl border border-green-200">
            {/* Summary text describing most recent session */}
            <p className="text-sm text-gray-700">
              {/* Bold "Latest:" prefix */}
              <span className="font-semibold">Latest:</span> Completed 4-minute Fourfold Breath session. 
              {/* Stress reduction value in bold green */}
              Estimated Stress Reduction: <span className="font-semibold text-green-700">-15 points</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
