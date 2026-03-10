// Import React's useState hook for managing component state
import { useState } from "react";
// Import Link component from react-router for navigation between pages
import { Link } from "react-router";
// Import icon components from lucide-react library for UI elements
import { Heart, TrendingUp, Activity, ZoomIn, ZoomOut, Award } from "lucide-react";
// Import Recharts components for rendering interactive heart rate chart
import {
  LineChart,        // Main line chart component
  Line,            // Line component for plotting data
  XAxis,           // X-axis component (time labels)
  YAxis,           // Y-axis component (BPM values)
  CartesianGrid,   // Grid background for chart
  Tooltip,         // Hover tooltip component
  ResponsiveContainer, // Wrapper for responsive sizing
  ReferenceLine,   // Horizontal/vertical reference lines (zone boundaries)
  ReferenceArea,   // Shaded background areas (color zones)
  Area,            // Area chart component (unused but imported)
  ComposedChart,   // Chart that can combine multiple chart types (unused but imported)
} from "recharts";

// Define TypeScript type for time scale options (ensures type safety)
type TimeScale = "Today" | "Week" | "Month" | "Year";

/**
 * Mock heart rate data organized by time scale
 * Each entry contains:
 * - time: Label for x-axis (e.g., "6am", "Mon", "Week 1", "Jan")
 * - actual: Current heart rate reading in BPM (varies to create slopes)
 * - baseline: Static baseline value for comparison (always 75 BPM)
 */
const mockData = {
  // Today view: Hourly readings from 6am to 9pm showing natural daily heart rate pattern
  Today: [
    { time: "6am", actual: 58, baseline: 75 },    // Morning low - waking from sleep
    { time: "7am", actual: 64, baseline: 75 },    // Gradual rise
    { time: "8am", actual: 71, baseline: 75 },    // Approaching baseline
    { time: "9am", actual: 76, baseline: 75 },    // Morning activity begins
    { time: "10am", actual: 82, baseline: 75 },   // Active morning
    { time: "11am", actual: 88, baseline: 75 },   // Pre-lunch activity
    { time: "12pm", actual: 91, baseline: 75 },   // Midday peak
    { time: "1pm", actual: 94, baseline: 75 },    // Post-lunch activity
    { time: "2pm", actual: 96, baseline: 75 },    // Afternoon peak - highest reading
    { time: "3pm", actual: 93, baseline: 75 },    // Starting to decline
    { time: "4pm", actual: 87, baseline: 75 },    // Afternoon decline
    { time: "5pm", actual: 81, baseline: 75 },    // Evening slowdown
    { time: "6pm", actual: 77, baseline: 75 },    // Dinner time - near baseline
    { time: "7pm", actual: 73, baseline: 75 },    // Relaxation begins
    { time: "8pm", actual: 68, baseline: 75 },    // Evening rest
    { time: "9pm", actual: 62, baseline: 75 },    // Pre-sleep low
  ],
  // Week view: Daily readings showing weekly pattern with midweek peak
  Week: [
    { time: "Mon", actual: 68, baseline: 75 },    // Monday - moderate start
    { time: "Tue", actual: 74, baseline: 75 },    // Tuesday - building
    { time: "Wed", actual: 82, baseline: 75 },    // Wednesday - active midweek
    { time: "Thu", actual: 91, baseline: 75 },    // Thursday - peak activity
    { time: "Fri", actual: 85, baseline: 75 },    // Friday - high but declining
    { time: "Sat", actual: 72, baseline: 75 },    // Saturday - weekend rest
    { time: "Sun", actual: 64, baseline: 75 },    // Sunday - lowest (recovery day)
  ],
  // Month view: Weekly averages showing monthly trend with Week 3 peak
  Month: [
    { time: "Week 1", actual: 72, baseline: 75 }, // First week - starting moderate
    { time: "Week 2", actual: 84, baseline: 75 }, // Second week - increasing
    { time: "Week 3", actual: 92, baseline: 75 }, // Third week - busiest period
    { time: "Week 4", actual: 76, baseline: 75 }, // Fourth week - winding down
  ],
  // Year view: Monthly readings showing seasonal variations
  Year: [
    { time: "Jan", actual: 70, baseline: 75 },    // January - winter low
    { time: "Feb", actual: 73, baseline: 75 },    // February - slight increase
    { time: "Mar", actual: 78, baseline: 75 },    // March - spring activity
    { time: "Apr", actual: 84, baseline: 75 },    // April - more active
    { time: "May", actual: 89, baseline: 75 },    // May - peak spring activity
    { time: "Jun", actual: 82, baseline: 75 },    // June - summer begins
    { time: "Jul", actual: 74, baseline: 75 },    // July - summer slowdown
    { time: "Aug", actual: 71, baseline: 75 },    // August - low summer activity
    { time: "Sep", actual: 79, baseline: 75 },    // September - autumn pickup
    { time: "Oct", actual: 86, baseline: 75 },    // October - fall activity
    { time: "Nov", actual: 81, baseline: 75 },    // November - declining
    { time: "Dec", actual: 75, baseline: 75 },    // December - back to baseline
  ],
};

/**
 * Highlight readings array - displays notable heart rate moments from the day
 * Used to show users when their heart rate peaked or dropped significantly
 */
const highlights = [
  { time: "3:00 PM", reading: "90 bpm", level: "moderate" },  // Afternoon peak
  { time: "12:00 PM", reading: "85 bpm", level: "moderate" }, // Lunch time activity
  { time: "6:00 AM", reading: "62 bpm", level: "low" },       // Morning resting rate
];

/**
 * LevelsPage Component
 * Main dashboard displaying heart rate tracking with interactive chart,
 * zonal mapping, time-scale navigation, and wellness features
 */
export function LevelsPage() {
  // State: Current selected time scale (Today/Week/Month/Year)
  const [timeScale, setTimeScale] = useState<TimeScale>("Today");
  // State: Current zoom level - 1 is default, 2 is max zoom in, 0.5 is max zoom out
  const [zoomLevel, setZoomLevel] = useState(1);
  // State: Distance between two touch points during pinch gesture (null when not pinching)
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  // State: Controls visibility of "Well Done" achievement badge
  const [showWellDoneBadge, setShowWellDoneBadge] = useState(false);
  // State: Stores user's text input for micro-journal check-in
  const [journalResponse, setJournalResponse] = useState("");

  /**
   * Check if any heart rate readings in current time scale exceed 100 BPM (high zone)
   * Used to conditionally show mind-body check-in prompt
   * Returns: boolean - true if any reading is above 100 BPM
   */
  const hasHighReading = mockData[timeScale].some(reading => reading.actual > 100);
  
  /**
   * Trigger haptic feedback (vibration) and show achievement badge
   * Called when user's heart rate improves from high to normal zone
   * Provides positive reinforcement through physical feedback and visual reward
   */
  const triggerHapticFeedback = () => {
    // Check if browser supports vibration API
    if ('vibrate' in navigator) {
      // Vibrate in pattern: 100ms on, 50ms off, 100ms on (celebratory pulse)
      navigator.vibrate([100, 50, 100]);
    }
    // Show the "Well Done" badge
    setShowWellDoneBadge(true);
    // Auto-hide badge after 5 seconds (5000 milliseconds)
    setTimeout(() => setShowWellDoneBadge(false), 5000);
  };

  /**
   * Zoom in handler - increases zoom level by 0.25x increments
   * Maximum zoom is capped at 2x to prevent over-zooming
   */
  const handleZoomIn = () => {
    // Update zoomLevel, using Math.min to cap at 2.0
    setZoomLevel(prev => Math.min(prev + 0.25, 2));
  };

  /**
   * Zoom out handler - decreases zoom level by 0.25x increments
   * Minimum zoom is capped at 0.5x to maintain readability
   */
  const handleZoomOut = () => {
    // Update zoomLevel, using Math.max to prevent going below 0.5
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  /**
   * Reset zoom handler - returns zoom level to default 1x
   */
  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  /**
   * Calculate Euclidean distance between two touch points
   * Used for pinch-to-zoom gesture detection
   * @param touches - TouchList containing touch point coordinates
   * @returns Distance in pixels, or null if less than 2 touches
   */
  const getTouchDistance = (touches: TouchList) => {
    // Need exactly 2 fingers for pinch gesture
    if (touches.length < 2) return null;
    
    // Get coordinates of first touch point
    const touch1 = touches[0];
    // Get coordinates of second touch point
    const touch2 = touches[1];
    
    // Calculate horizontal distance between touches
    const dx = touch1.clientX - touch2.clientX;
    // Calculate vertical distance between touches
    const dy = touch1.clientY - touch2.clientY;
    
    // Return Euclidean distance using Pythagorean theorem: √(dx² + dy²)
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * Handle touch start event for pinch-to-zoom
   * Records initial distance between two fingers when pinch begins
   * @param e - React touch event containing touch point data
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only process if exactly 2 fingers are touching (pinch gesture)
    if (e.touches.length === 2) {
      // Calculate and store initial distance between fingers
      const distance = getTouchDistance(e.touches);
      setTouchDistance(distance);
    }
  };

  /**
   * Handle touch move event for pinch-to-zoom
   * Calculates zoom change based on finger movement during pinch
   * @param e - React touch event containing current touch positions
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    // Only process if 2 fingers are touching AND we have initial distance recorded
    if (e.touches.length === 2 && touchDistance !== null) {
      // Prevent default browser pinch-zoom behavior
      e.preventDefault();
      
      // Calculate current distance between fingers
      const currentDistance = getTouchDistance(e.touches);
      
      if (currentDistance !== null) {
        // Calculate scale factor (how much distance changed)
        // scale > 1 means fingers moved apart (zoom in)
        // scale < 1 means fingers moved together (zoom out)
        const scale = currentDistance / touchDistance;
        
        // Convert scale to zoom change, multiply by 0.5 to reduce sensitivity
        const zoomChange = (scale - 1) * 0.5;
        
        // Update zoom level with calculated change
        setZoomLevel(prev => {
          // Add zoom change to current level
          const newZoom = prev + zoomChange;
          // Clamp result between 0.5 and 2.0 using Math.max and Math.min
          return Math.max(0.5, Math.min(2, newZoom));
        });
        
        // Update stored distance for next move event (continuous tracking)
        setTouchDistance(currentDistance);
      }
    }
  };

  /**
   * Handle touch end event - cleanup when fingers lift from screen
   * Resets touchDistance to allow new pinch gesture to start fresh
   */
  const handleTouchEnd = () => {
    // Clear stored distance (null indicates no active pinch)
    setTouchDistance(null);
  };

  /**
   * Calculate dynamic Y-axis domain (min/max values) based on current zoom level
   * Higher zoom levels show narrower range for more detail
   * @returns Array of [minValue, maxValue] for Y-axis
   */
  const getYAxisDomain = () => {
    // Base minimum BPM value (lowest possible heart rate shown)
    const baseMin = 50;
    // Base maximum BPM value (highest possible heart rate shown)
    const baseMax = 120;
    // Calculate center point of range (85 BPM)
    const center = (baseMin + baseMax) / 2;
    // Calculate range size based on zoom (higher zoom = smaller range)
    // At 1x zoom: range = 70, at 2x zoom: range = 35
    const range = (baseMax - baseMin) / zoomLevel;
    
    // Return [min, max] array centered on midpoint
    return [
      Math.round(center - range / 2), // Lower bound
      Math.round(center + range / 2)  // Upper bound
    ];
  };

  // Destructure Y-axis domain values for use in chart
  const [yMin, yMax] = getYAxisDomain();

  return (
    // Main page container: Full screen height, white background, dark text, responsive padding
    <div className="min-h-screen bg-white text-gray-900 pb-6 px-4 sm:px-6">
      {/* Page header with 3D glassmorphism bubble decoration */}
      <div className="relative pt-8 pb-6 text-center">
        {/* Outer glow bubble - large blurred gradient background */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-br from-blue-500/20 to-blue-300/10 rounded-full blur-2xl"></div>
        {/* Inner glass bubble - frosted glass effect with border */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-16 bg-blue-100/60 rounded-full border border-blue-200/40 backdrop-blur-xl"></div>
        
        {/* Main page title - positioned above decorative bubbles using z-index */}
        <h1 className="relative text-4xl sm:text-5xl tracking-tight text-gray-900">Levels</h1>
      </div>

      {/* Time scale selector - Centered pill-shaped button group */}
      <div className="mb-6 flex justify-center">
        {/* Glassmorphism container for time scale buttons */}
        <div className="backdrop-blur-xl bg-blue-50/80 rounded-full p-1 inline-flex border border-blue-200/50 shadow-sm">
          {/* Map through time scale options to create buttons */}
          {(["Today", "Week", "Month", "Year"] as TimeScale[]).map((scale) => (
            <button
              key={scale}
              // Update selected time scale when clicked
              onClick={() => setTimeScale(scale)}
              // Dynamic classes: selected button gets blue background, unselected gets gray text
              className={`px-6 py-3 rounded-full transition-all whitespace-nowrap ${
                timeScale === scale
                  ? "bg-blue-500 text-white shadow-lg"      // Active state - blue with shadow
                  : "text-gray-600 hover:text-gray-900"      // Inactive state - gray with hover
              }`}
            >
              {scale}
            </button>
          ))}
        </div>
      </div>

      {/* Heart rate chart section with zonal color mapping */}
      <div className="backdrop-blur-xl bg-blue-50/50 rounded-3xl p-4 sm:p-6 border border-blue-200/50 mb-6 shadow-sm">
        {/* Average BPM display above chart */}
        <div className="mb-6">
          {/* Dynamic label based on selected time scale */}
          <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide mb-1">
            {timeScale === "Today" ? "Daily Average" : timeScale === "Week" ? "Weekly Average" : timeScale === "Month" ? "Monthly Average" : "Yearly Average"}
          </div>
          {/* Large BPM number display with unit label */}
          <div className="text-4xl sm:text-5xl font-bold">
            {/* Dynamic average BPM value based on time scale (pink color for emphasis) */}
            <span className="text-pink-500">
              {timeScale === "Today" ? "78" : timeScale === "Week" ? "77" : timeScale === "Month" ? "80" : "77"}
            </span>
            {/* Unit label "bpm" in smaller gray text */}
            <span className="text-gray-400 text-2xl sm:text-3xl ml-2">bpm</span>
          </div>
        </div>
        
        {/* Recharts responsive container - automatically sizes to parent width, fixed 300px height */}
        <ResponsiveContainer width="100%" height={300}>
          {/* LineChart with touch event handlers for pinch-to-zoom */}
          <LineChart 
            data={mockData[timeScale]} 
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove} 
            onTouchEnd={handleTouchEnd}
          >
            {/* Color-coded background zones indicating heart rate categories */}
            {/* GREEN ZONE: Resting heart rate (50-70 BPM) */}
            <ReferenceArea y1={50} y2={70} fill="#22c55e" fillOpacity={0.08} />
            {/* AMBER ZONE: Normal active heart rate (70-90 BPM) */}
            <ReferenceArea y1={70} y2={90} fill="#f59e0b" fillOpacity={0.08} />
            {/* RED ZONE: Elevated heart rate (90-120 BPM) */}
            <ReferenceArea y1={90} y2={120} fill="#ef4444" fillOpacity={0.08} />
            
            {/* Grid lines with dashed pattern and subtle opacity */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            
            {/* X-axis showing time labels (6am, Mon, Week 1, Jan, etc.) */}
            <XAxis 
              dataKey="time"                          // Data field to display
              stroke="rgba(0,0,0,0.6)"                // Axis line color
              style={{ fontSize: '11px' }}            // Small font for mobile readability
            />
            
            {/* Y-axis showing BPM values */}
            <YAxis 
              stroke="rgba(0,0,0,0.6)"                // Axis line color
              style={{ fontSize: '11px' }}            // Small font for mobile readability
              domain={[yMin, yMax]}                   // Dynamic domain based on zoom level
              label={{                                 // "bpm" label rotated vertically
                value: 'bpm', 
                angle: -90,                           // Rotate 90° counter-clockwise
                position: 'insideLeft',               // Position inside left edge
                fill: 'rgba(0,0,0,0.6)', 
                fontSize: 11 
              }}
            />
            
            {/* Horizontal reference lines marking zone boundaries */}
            {/* Green zone upper boundary at 70 BPM */}
            <ReferenceLine 
              y={70} 
              stroke="rgba(34, 197, 94, 0.4)" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Resting',                     // Label text
                position: 'insideTopLeft',            // Position label
                fill: 'rgba(0,0,0,0.6)', 
                fontSize: 10 
              }} 
            />
            {/* Amber zone upper boundary at 90 BPM */}
            <ReferenceLine 
              y={90} 
              stroke="rgba(245, 158, 11, 0.4)" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Normal', 
                position: 'insideTopLeft', 
                fill: 'rgba(0,0,0,0.6)', 
                fontSize: 10 
              }} 
            />
            {/* Red zone lower boundary at 100 BPM */}
            <ReferenceLine 
              y={100} 
              stroke="rgba(239, 68, 68, 0.4)" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Elevated', 
                position: 'insideTopLeft', 
                fill: 'rgba(0,0,0,0.6)', 
                fontSize: 10 
              }} 
            />
            
            {/* Hover tooltip with custom styling */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',  // Semi-transparent white
                border: '1px solid rgba(59, 130, 246, 0.3)',   // Blue border
                borderRadius: '12px',                          // Rounded corners
                color: '#1f2937'                               // Dark text
              }}
            />
            
            {/* Baseline reference line - dotted silver line at 75 BPM */}
            <Line 
              type="natural"                          // Smooth curve interpolation
              dataKey="baseline"                      // Data field for baseline values
              stroke="rgba(100,116,139,0.5)"          // Gray color with transparency
              strokeDasharray="5 5"                   // Dashed pattern
              dot={false}                             // No dots on data points
              name="Baseline"                         // Label for tooltip
            />
            
            {/* Actual heart rate line - solid blue line with dots */}
            <Line 
              type="natural"                          // Smooth curve creating slopes
              dataKey="actual"                        // Data field for actual HR values
              stroke="#3b82f6"                        // Solid blue color
              strokeWidth={3}                         // Thick line for visibility
              dot={{ fill: '#3b82f6', r: 4 }}        // Blue dots at each data point, radius 4px
              name="Current HR"                       // Label for tooltip
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Zone legend - Color-coded labels explaining what each zone means */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
          {/* Green zone indicator */}
          <div className="flex items-center gap-2">
            {/* Green circle */}
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            {/* Label with BPM range (using &lt; HTML entity for <) */}
            <span className="text-gray-600">Resting (&lt;70)</span>
          </div>
          {/* Amber zone indicator */}
          <div className="flex items-center gap-2">
            {/* Amber circle */}
            <div className="w-3 h-3 rounded-full bg-amber-500/60"></div>
            {/* Label with BPM range */}
            <span className="text-gray-600">Normal (70-90)</span>
          </div>
          {/* Red zone indicator */}
          <div className="flex items-center gap-2">
            {/* Red circle */}
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            {/* Label with BPM range (using &gt; HTML entity for >) */}
            <span className="text-gray-600">Elevated (&gt;90)</span>
          </div>
        </div>

        {/* Zoom control buttons - 3 buttons for zoom out, reset, zoom in */}
        <div className="mt-4 flex justify-center gap-4">
          {/* Zoom out button */}
          <button
            onClick={handleZoomOut}
            className="backdrop-blur-sm bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-3 sm:p-4 border border-blue-200/50"
          >
            {/* Zoom out icon - magnifying glass with minus */}
            <ZoomOut className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
          </button>
          {/* Reset zoom button (shows Activity icon as visual "reset" indicator) */}
          <button
            onClick={handleResetZoom}
            className="backdrop-blur-sm bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-3 sm:p-4 border border-blue-200/50"
          >
            {/* Activity icon represents "normal view" */}
            <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
          </button>
          {/* Zoom in button */}
          <button
            onClick={handleZoomIn}
            className="backdrop-blur-sm bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-3 sm:p-4 border border-blue-200/50"
          >
            {/* Zoom in icon - magnifying glass with plus */}
            <ZoomIn className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Data summary section - Contains wellness features and status widgets */}
      <div className="space-y-4 mb-6">
        {/* Micro-journal prompt - Only shown when user has high heart rate reading */}
        {hasHighReading && (
          // Card with fade-in animation
          <div className="bg-white/80 rounded-3xl p-4 sm:p-6 border border-red-200 shadow-sm animate-[fadeIn_0.5s_ease-in]">
            {/* Section title with heart icon */}
            <h3 className="text-base sm:text-lg mb-3 text-gray-900 flex items-center gap-2">
              {/* Red heart icon (16x20px) */}
              <Heart className="w-5 h-5 text-red-500" />
              Mind-Body Check-In
            </h3>
            {/* Explanation text */}
            <p className="text-sm text-gray-600 mb-4">
              We noticed a high reading. Let's check in with your body:
            </p>
            {/* Checklist of common physical symptoms */}
            <div className="space-y-3">
              {/* Checkbox 1: Chest tightness */}
              <label className="block">
                <input
                  type="checkbox"
                  className="mr-2 accent-red-500"  // Custom red checkbox color
                />
                <span className="text-sm text-gray-700">Feeling a bit tight in the chest?</span>
              </label>
              {/* Checkbox 2: Shallow breathing */}
              <label className="block">
                <input
                  type="checkbox"
                  className="mr-2 accent-red-500"
                />
                <span className="text-sm text-gray-700">Notice any shallow breathing?</span>
              </label>
              {/* Checkbox 3: Muscle tension */}
              <label className="block">
                <input
                  type="checkbox"
                  className="mr-2 accent-red-500"
                />
                <span className="text-sm text-gray-700">Feeling tense in shoulders or neck?</span>
              </label>
              {/* Checkbox 4: External stressors */}
              <label className="block">
                <input
                  type="checkbox"
                  className="mr-2 accent-red-500"
                />
                <span className="text-sm text-gray-700">Had caffeine or stress recently?</span>
              </label>
            </div>
            {/* Free-form text area for additional notes */}
            <textarea
              value={journalResponse}                          // Controlled input
              onChange={(e) => setJournalResponse(e.target.value)}  // Update state on change
              placeholder="Quick note: What's happening right now? (optional)"
              className="w-full mt-4 p-3 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
              rows={3}                                          // 3 rows tall
            />
            {/* Save button */}
            <button
              onClick={() => {
                // Placeholder for save logic - would normally send to backend
                alert("Journal entry saved! Building awareness helps manage stress.");
              }}
              className="mt-3 w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full px-4 py-2 text-sm hover:from-red-600 hover:to-red-700 transition-all"
            >
              Save Check-In
            </button>
          </div>
        )}

        {/* Achievement badge - Only shown when showWellDoneBadge is true */}
        {showWellDoneBadge && (
          // Green gradient card with bounce animation
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-4 sm:p-6 border-2 border-green-400 shadow-lg animate-[bounce_0.5s_ease-in]">
            {/* Flex container with icon and text */}
            <div className="flex items-center gap-4">
              {/* Trophy icon in circular background */}
              <div className="bg-green-500 rounded-full p-4">
                {/* Award/trophy icon (48px) */}
                <Award className="w-12 h-12 text-white" />
              </div>
              {/* Achievement text */}
              <div>
                {/* Main congratulations message with emoji */}
                <h3 className="text-xl font-bold text-green-800 mb-1">Well Done! 🎉</h3>
                {/* Explanation of achievement */}
                <p className="text-sm text-green-700">
                  Your blood pressure moved from <span className="font-semibold">High</span> to <span className="font-semibold">Normal</span> range!
                </p>
                {/* Encouragement message */}
                <p className="text-xs text-green-600 mt-2">
                  Your calming efforts are working. Keep it up!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Highlight widget - Shows notable heart rate moments */}
        <div className="backdrop-blur-xl bg-blue-50/50 rounded-3xl p-4 sm:p-6 border border-blue-200/50 shadow-sm">
          {/* Section title */}
          <h3 className="text-base sm:text-lg mb-4 text-gray-900">Highlight</h3>
          {/* List of highlight cards */}
          <div className="space-y-3">
            {/* Map through highlights array to create cards */}
            {highlights.map((item, index) => (
              // Individual highlight card
              <div key={index} className="backdrop-blur-sm bg-white/60 rounded-2xl p-3 sm:p-4 border border-blue-100/50 shadow-sm">
                {/* Time stamp */}
                <div className="text-xs sm:text-sm text-gray-600 mb-1">{item.time}</div>
                {/* Heart rate reading */}
                <div className="text-base sm:text-lg text-gray-900">{item.reading}</div>
                {/* Level indicator with dynamic color (red for high, amber for moderate) */}
                <div className={`text-xs mt-1 ${
                  item.level === 'high' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {/* Capitalize first letter of level */}
                  {item.level === 'high' ? 'High' : 'Moderate'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current status widgets - 2-column grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Current heart rate widget */}
          <div className="backdrop-blur-xl bg-blue-50/50 rounded-3xl p-4 sm:p-6 border border-blue-200/50 shadow-sm">
            {/* Flex container with icon and data */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Pink heart icon container */}
              <div className="backdrop-blur-sm bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-3 sm:p-4 border border-pink-200/50">
                {/* Heart icon (32-48px responsive) */}
                <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-pink-500" />
              </div>
              {/* Heart rate data */}
              <div>
                {/* Label */}
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Current Heart Rate</div>
                {/* Large BPM value */}
                <div className="text-2xl sm:text-3xl text-gray-900">75 bpm</div>
                {/* Status indicator - green for normal */}
                <div className="text-xs sm:text-sm text-green-600 mt-1">Normal</div>
              </div>
            </div>
          </div>

          {/* Trend widget */}
          <div className="backdrop-blur-xl bg-blue-50/50 rounded-3xl p-4 sm:p-6 border border-blue-200/50 shadow-sm">
            {/* Flex container with icon and data */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Blue trending icon container */}
              <div className="backdrop-blur-sm bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-3 sm:p-4 border border-blue-200/50">
                {/* Trending up icon (32-48px responsive) */}
                <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              {/* Trend data */}
              <div>
                {/* Label */}
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Trend</div>
                {/* Large percentage change with down arrow (improvement) */}
                <div className="text-2xl sm:text-3xl text-gray-900">↓ 3%</div>
                {/* Comparison period */}
                <div className="text-xs sm:text-sm text-gray-600 mt-1">vs. last week</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions footer - Health tips and navigation to Calm State page */}
      <div className="backdrop-blur-xl bg-blue-50/50 rounded-3xl p-4 sm:p-6 border border-blue-200/50 shadow-sm mb-6">
        {/* Section title */}
        <h3 className="text-base sm:text-lg mb-4 text-gray-900">Suggestions</h3>
        {/* List of health suggestions */}
        <div className="space-y-3 text-sm sm:text-base text-gray-700">
          {/* Suggestion 1: Breathing exercise */}
          <p>• Try a 10-minute breathing exercise to help lower your resting heart rate</p>
          {/* Suggestion 2: Caffeine reduction */}
          <p>• Consider reducing caffeine intake - it can temporarily raise HR by 10-15 bpm</p>
          {/* Suggestion 3: Cardio exercise */}
          <p>• Regular cardio exercise can improve your overall heart rate variability</p>
          {/* Suggestion 4: Sleep quality */}
          <p>• Ensure you're getting quality sleep - poor sleep elevates resting heart rate</p>
        </div>
        
        {/* Navigation button to Calm State page */}
        <Link 
          to="/calm-state"  // React Router link to Calm State page
          className="mt-6 block text-center backdrop-blur-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-6 sm:px-8 py-3 border border-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        >
          View Calm State Analysis
        </Link>
      </div>
    </div>
  );
}