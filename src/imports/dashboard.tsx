// Import useState hook for managing component-level state (menu open/closed)
import { useState } from "react";

// Import navigation hooks from react-router
// - useNavigate: Programmatically navigate to different pages
// - Link: Component for creating navigation links
import { useNavigate, Link } from "react-router";

// Import icon components from lucide-react library for UI visual elements
// Each icon serves a specific purpose in the navigation and display
import { Menu, Home, FileText, Activity, Database, LogOut, Heart, Droplet, CheckCircle, Smile, Baby, Sparkles } from "lucide-react";

// Import UI components from our component library
// These provide consistent styling and behavior across the app
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { HealthGauge } from "../components/health-gauge";
import { AlertCard } from "../components/alert-card";
import { VideoCard } from "../components/video-card";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";

// Import useHealth hook to access global health simulation data
// This connects the dashboard to the real-time health metrics running in the background
import { useHealth } from "../context/health-context";

// Main Dashboard component - the primary interface users see after logging in
// This page displays real-time health monitoring and mood-based recommendations
export default function Dashboard() {
  // Initialize navigation function for programmatic route changes
  const navigate = useNavigate();
  
  // State to control hamburger menu visibility (open/closed)
  // Used for mobile navigation drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Retrieve username from localStorage or default to "User"
  // This was stored during the authentication process
  const userName = localStorage.getItem("userName") || "User";
  
  // ========================================
  // ACCESS REAL-TIME HEALTH DATA
  // ========================================
  // Get health data from context
  const { heartRate, spo2, bloodPressure, showHighBPAlert, mood, steps } = useHealth();
  
  // ========================================
  // CALCULATE OVERALL HEALTH STATUS
  // ========================================
  // Determine if all vitals are within normal healthy ranges
  // This creates a composite "everything is okay" indicator
  // Normal thresholds:
  // - Heart rate ≤ 80 BPM (resting heart rate)
  // - SpO2 ≥ 95% (healthy oxygen saturation)
  // - Systolic BP ≤ 130 mmHg (normal blood pressure)
  // If all three conditions are true, isNormal = true and green checkmark displays
  const isNormal = heartRate <= 80 && spo2 >= 95 && bloodPressure.systolic <= 130;

  // Handle user sign out action
  // Clears authentication data and returns user to login page
  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated"); // Clear login flag
    localStorage.removeItem("userName"); // Clear stored username
    navigate("/"); // Redirect to authentication page
  };

  // Define navigation menu items with icons, labels, and routes
  // This array is used to render both the hamburger menu and bottom mobile navigation
  // Keeping it centralized ensures consistency across navigation methods
  const navigationItems = [
    { icon: Home, label: "HOME", path: "/dashboard" }, // Current page
    { icon: FileText, label: "REPORT", path: "/report" }, // Health reports with download
    { icon: Activity, label: "TRACKED", path: "/tracked" }, // Charts and graphs
    { icon: Database, label: "DATA", path: "/data" }, // Raw data table
  ];

  // ========================================
  // MOOD-BASED VIDEO RECOMMENDATION SYSTEM
  // ========================================
  // This function returns different video arrays based on the user's current mood
  // The mood is automatically calculated in health-context.tsx based on heart rate:
  // - 'calm': HR ≤ 90 BPM (normal phase)
  // - 'slightly-anxious': HR 90-105 BPM (building phase)
  // - 'anxious': HR > 105 BPM (peak/plateau phase)
  // - 'recovering': Recovery phase after stress
  //
  // AS THE SIMULATION PROGRESSES, THE MOOD CHANGES AND VIDEOS UPDATE AUTOMATICALLY
  // This is the core of the dynamic content system - videos match user's current state
  const getVideosForMood = () => {
    switch (mood) {
      // ========================================
      // CALM STATE VIDEOS (HR ≤ 90 BPM)
      // ========================================
      // When user is in normal resting state (first 10 seconds of simulation)
      // Show wellness and maintenance content to keep them feeling good
      case 'calm':
        return [
          {
            title: "Morning Meditation for Positivity",
            // Unsplash image of peaceful meditation scene
            thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "10:00", // Video length display
            category: "Meditation", // Category tag shown above title
            url: "https://www.youtube.com/watch?v=inpok4MKVLM" // Actual YouTube video link
          },
          {
            title: "Gentle Stretching Routine",
            thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "15:30",
            category: "Exercise",
            url: "https://www.youtube.com/watch?v=g_tea8ZNk5A"
          },
          {
            title: "Peaceful Nature Sounds",
            thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "30:00",
            category: "Relaxation",
            url: "https://www.youtube.com/watch?v=eKFTSSKCzWA"
          },
          {
            title: "Mindful Walking Exercise",
            thumbnail: "https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "12:00",
            category: "Mindfulness",
            url: "https://www.youtube.com/watch?v=vZnVwuuxYqU"
          },
        ];

      // ========================================
      // SLIGHTLY ANXIOUS STATE VIDEOS (HR 90-105 BPM)
      // ========================================
      // When simulation enters building phase (seconds 10-30)
      // Heart rate is climbing, user may notice stress building
      // Show calming techniques and preventive exercises
      case 'slightly-anxious':
        return [
          {
            title: "5-Minute Breathing Exercise",
            thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "5:23",
            category: "Breathing", // Focus on breath control
            url: "https://www.youtube.com/watch?v=tybOi4hjZFQ"
          },
          {
            title: "Calming Yoga Flow",
            thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "20:15",
            category: "Yoga", // Gentle movement to release tension
            url: "https://www.youtube.com/watch?v=v7AYKMP6rOE"
          },
          {
            title: "Progressive Muscle Relaxation",
            thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "15:40",
            category: "Relaxation", // Systematic tension release
            url: "https://www.youtube.com/watch?v=86HUcX8ZtAk"
          },
          {
            title: "Guided Meditation for Anxiety",
            thumbnail: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "10:00",
            category: "Meditation",
            url: "https://www.youtube.com/watch?v=O-6f5wQXSu8"
          },
        ];

      // ========================================
      // ANXIOUS STATE VIDEOS (HR > 105 BPM)
      // ========================================
      // When simulation reaches peak/plateau (seconds 30-65)
      // Heart rate is high (105-112 BPM), user is experiencing stress
      // Show IMMEDIATE relief techniques and emergency calming methods
      // These are shorter, more urgent interventions
      case 'anxious':
        return [
          {
            title: "Emergency Calm Down Technique",
            thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "3:45", // SHORT duration for immediate help
            category: "Emergency", // Marked as urgent/emergency content
            url: "https://www.youtube.com/watch?v=cEqZthCaMpo"
          },
          {
            title: "4-7-8 Breathing for Panic Relief",
            thumbnail: "https://images.unsplash.com/photo-1447968954315-3f0c44f42f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "5:00",
            category: "Breathing", // Specific breathing pattern for anxiety
            url: "https://www.youtube.com/watch?v=gz4G31LGyog"
          },
          {
            title: "Grounding Technique for Anxiety",
            thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "8:30",
            category: "Grounding", // 5-4-3-2-1 technique to reconnect with present
            url: "https://www.youtube.com/watch?v=30VMIEmA114"
          },
          {
            title: "Quick Stress Relief Meditation",
            thumbnail: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "6:15",
            category: "Meditation",
            url: "https://www.youtube.com/watch?v=SEfs5TJZ6Nk"
          },
        ];

      // ========================================
      // RECOVERING STATE VIDEOS (Recovery Phase)
      // ========================================
      // When simulation enters recovery or user clicks "I'm feeling okay"
      // Heart rate is returning to normal (descending from 100+ to 72)
      // Show recovery, restoration, and self-care content
      // Help user consolidate calm state and prevent recurrence
      case 'recovering':
        return [
          {
            title: "Recovery and Restoration Meditation",
            thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "12:00",
            category: "Recovery", // Specific recovery-focused content
            url: "https://www.youtube.com/watch?v=ZToicYcHIOU"
          },
          {
            title: "Gentle Self-Care Yoga",
            thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "25:00",
            category: "Yoga", // Gentle restorative poses
            url: "https://www.youtube.com/watch?v=Eml2xnoLpYE"
          },
          {
            title: "Healing Visualization Practice",
            thumbnail: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "15:00",
            category: "Visualization", // Mental imagery for healing
            url: "https://www.youtube.com/watch?v=z6X5oEIg6Ak"
          },
          {
            title: "Restorative Breathing Exercises",
            thumbnail: "https://images.unsplash.com/photo-1447968954315-3f0c44f42f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "10:30",
            category: "Breathing",
            url: "https://www.youtube.com/watch?v=aNXKjGFUlMs"
          },
        ];

      // Default case (should never reach here with current mood values)
      default:
        return [];
    }
  };

  // Get the appropriate videos for current mood
  // This variable is reactive - when mood changes in context, videos array updates
  // React will automatically re-render the video section with new recommendations
  const videos = getVideosForMood();

  // ========================================
  // DYNAMIC MESSAGE BASED ON MOOD STATE
  // ========================================
  // Generate contextual message that appears above video recommendations
  // This message updates in real-time as the simulation progresses through phases
  // It provides user feedback about why they're seeing specific content
  const getMoodMessage = () => {
    switch (mood) {
      case 'calm':
        // Positive reinforcement during normal state
        return "You're feeling great! Here are some videos to maintain your wellness";
      case 'slightly-anxious':
        // Gentle acknowledgment of rising stress with helpful framing
        return "Feeling a bit tense? These videos can help you relax";
      case 'anxious':
        // Direct acknowledgment with immediate action items
        // "We noticed" uses empathetic language to validate user experience
        return "We noticed elevated stress. Try these immediate relief techniques";
      case 'recovering':
        // Positive reinforcement of progress to encourage continued recovery
        return "Great progress! Here are recovery-focused videos for you";
      default:
        // Fallback generic message
        return "Curated content to help you relax and stay healthy";
    }
  };

  return (
    // Main container - full screen height with light gray background
    <div className="min-h-screen bg-gray-50">
      
      {/* ========================================
          HEADER WITH NAVIGATION
          ======================================== */}
      {/* Sticky header stays at top when scrolling, white background with border */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* HAMBURGER MENU (Left side) */}
          {/* Sheet component creates slide-out drawer navigation */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              {/* Button that opens the navigation drawer */}
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            
            {/* Navigation drawer content - slides in from left */}
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>ANXIOCHECK</SheetTitle>
                <SheetDescription>Navigate through your health dashboard</SheetDescription>
              </SheetHeader>
              
              {/* Navigation menu */}
              <nav className="mt-8">
                {/* Navigation links list */}
                <ul className="space-y-2">
                  {/* Map through navigation items array to render links */}
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      {/* Link component for client-side navigation (no page reload) */}
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)} // Close drawer after clicking
                      >
                        <item.icon className="w-5 h-5" /> {/* Dynamic icon component */}
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {/* Sign out section at bottom of drawer */}
                <div className="mt-8 pt-8 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    SIGN OUT
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* ANXIOCHECK LOGO AND TITLE (Center) */}
          {/* Brand identity centered in header */}
          <div className="flex items-center gap-2">
            {/* Circular blue gradient background */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              {/* Custom SVG: White heart with angel wings (brand logo) */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left wing feathers */}
                <path d="M8 18C8 18 4 16 2 14C0.5 12.5 0 11 0.5 10C1 9 2 9 3 10C4.5 11.5 6 13.5 7 15C7.5 16 8 17 8 18Z" fill="white" />
                <path d="M7 20C7 20 3.5 19 1.5 17.5C0 16.5 -0.5 15.5 0 14.5C0.5 13.5 1.5 13.5 2.5 14.5C4 15.5 5.5 17 6.5 18.5C6.8 19 7 19.5 7 20Z" fill="white" />
                <path d="M7 22C7 22 4 21.5 2.5 20.5C1.5 19.8 1 19 1.5 18C2 17 3 17.5 4 18.5C5 19.5 6 20.5 6.5 21.5C6.8 21.8 7 22 7 22Z" fill="white" />
                {/* Heart center */}
                <path d="M20 32C20 32 5 24 5 14C5 10 7.5 7.5 11 7.5C14 7.5 17 10 20 13C23 10 26 7.5 29 7.5C32.5 7.5 35 10 35 14C35 24 20 32 20 32Z" fill="white" />
                {/* Right wing feathers */}
                <path d="M32 18C32 18 36 16 38 14C39.5 12.5 40 11 39.5 10C39 9 38 9 37 10C35.5 11.5 34 13.5 33 15C32.5 16 32 17 32 18Z" fill="white" />
                <path d="M33 20C33 20 36.5 19 38.5 17.5C40 16.5 40.5 15.5 40 14.5C39.5 13.5 38.5 13.5 37.5 14.5C36 15.5 34.5 17 33.5 18.5C33.2 19 33 19.5 33 20Z" fill="white" />
                <path d="M33 22C33 22 36 21.5 37.5 20.5C38.5 19.8 39 19 38.5 18C38 17 37 17.5 36 18.5C35 19.5 34 20.5 33.5 21.5C33.2 21.8 33 22 33 22Z" fill="white" />
              </svg>
            </div>
            {/* App name */}
            <h1 className="font-bold text-lg">ANXIOCHECK</h1>
          </div>

          {/* RIGHT SIDE: User Status & Sign Out */}
          {/* Container for user controls */}
          <div className="flex items-center gap-3">
            
            {/* ========================================
                INTERACTIVE MOOD/CALM STATUS BADGE
                CLICKABLE - NAVIGATES TO CALM PAGE
                ======================================== */}
            {/* Show mood indicator badge - click to access relaxation tools */}
            <button
              onClick={() => navigate("/calm")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                mood === 'calm' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                mood === 'slightly-anxious' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                mood === 'anxious' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              title="Click to access relaxation tools"
            >
              {mood === 'calm' && <Smile className="w-4 h-4" />}
              {mood === 'slightly-anxious' && <Baby className="w-4 h-4" />}
              {mood === 'anxious' && <Activity className="w-4 h-4" />}
              {mood === 'recovering' && <Sparkles className="w-4 h-4" />}
              <span className="capitalize">
                {mood === 'calm' ? 'Calm' :
                 mood === 'slightly-anxious' ? 'Tense' :
                 mood === 'anxious' ? 'Anxious' :
                 'Recovering'}
              </span>
            </button>
            
            {/* SIGN OUT BUTTON */}
            {/* Handles user logout with confirmation */}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              SIGN OUT
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================
          MAIN DASHBOARD CONTENT
          ======================================== */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* ========================================
            WELCOME BANNER WITH PERSONALIZATION
            ======================================== */}
        {/* Gradient banner using blue theme colors */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h2>
          <p className="opacity-90">Here's your health overview for today</p>
        </div>

        {/* ========================================
            DYNAMIC STATUS ALERTS
            CHANGES BASED ON SIMULATION STATE
            ======================================== */}
        <div className="space-y-3">
          
          {/* GREEN "ALL NORMAL" ALERT */}
          {/* Only shows when all vitals are healthy (HR ≤ 80, SpO2 ≥ 95, BP ≤ 130) */}
          {/* During simulation: Shows in first 10 seconds, then disappears as HR rises */}
          {/* Returns when simulation reaches recovery and normalizes */}
          {isNormal && (
            <AlertCard
              title="Things are looking normal"
              description="All your vital signs are within healthy ranges"
              severity="normal" // Green styling
              expandable={false} // No expand/collapse functionality needed
            />
          )}
          
          {/* WARNING ALERT FOR HIGH BLOOD PRESSURE */}
          {/* Shows when heart rate > 100 BPM (abnormal threshold) */}
          {/* During simulation: Appears around second 15-20 of building phase */}
          {/* Stays visible through peak and plateau phases */}
          {/* Automatically dismisses when HR returns to ≤ 100 */}
          {/* CLICKABLE: Entire alert navigates to danger assessment page */}
          {showHighBPAlert && (
            <div 
              onClick={() => navigate("/danger-check")} // Navigate to emergency assessment
              className="cursor-pointer hover:opacity-80 transition-opacity" // Visual feedback on hover
            >
              <AlertCard
                title="High blood pressure detected"
                description="Tap to assess your condition and get recommendations"
                severity="warning" // Orange/yellow styling for caution
                expandable={false}
              />
            </div>
          )}
        </div>

        {/* ========================================
            GREEN CHECKMARK STATUS INDICATOR
            SHOWS WHEN ALL SYSTEMS NORMAL
            ======================================== */}
        {/* Large green banner with checkmark icon */}
        {/* Only displays when isNormal = true (all vitals healthy) */}
        {/* Provides quick visual confirmation everything is okay */}
        {isNormal && (
          <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-semibold">All Systems Normal</span>
          </div>
        )}

        {/* ========================================
            VITAL SIGNS DISPLAY GRID
            REAL-TIME UPDATING VALUES
            ======================================== */}
        {/* Two-column grid on desktop, stacks on mobile */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* HEART RATE GAUGE */}
          {/* HealthGauge component renders circular gauge with needle */}
          {/* VALUE CHANGES EVERY 2 SECONDS as simulation progresses */}
          {/* Simulation progression:
               - Seconds 0-10: 70-75 BPM (normal fluctuations)
               - Seconds 10-30: 75-105 BPM (building anxiety)
               - Seconds 30-45: 105-112 BPM (peak anxiety)
               - Seconds 45-65: 95-100 BPM (plateau)
               - Seconds 65+: 100-72 BPM (recovery)
          */}
          <HealthGauge
            value={heartRate} // Current heart rate from context (updates automatically)
            min={40} // Minimum value for gauge scale
            max={160} // Maximum value for gauge scale
            label="Blood Flow (Heart Rate)" // Display label
            unit="BPM" // Units text
          />

          {/* BLOOD OXYGEN (SpO2) DISPLAY */}
          {/* Large number display with status indicator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-600" />
                SpO2 (Blood Oxygen)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                {/* MAIN SpO2 VALUE DISPLAY */}
                {/* Math.round() converts decimal to whole number for cleaner display */}
                {/* Color changes based on value:
                     - Blue (healthy): SpO2 ≥ 95%
                     - Orange (warning): SpO2 < 95%
                */}
                {/* VALUE CHANGES DURING SIMULATION:
                     - Normal: 97-98%
                     - Building: 98% → 94% (gradual decrease)
                     - Peak: 92-94% (lowest point)
                     - Plateau: 93-95% (stabilizing)
                     - Recovery: 95% → 98% (returning to normal)
                */}
                <div className={`text-5xl font-bold ${spo2 >= 95 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {Math.round(spo2)}%
                </div>
                
                <div className="text-sm text-gray-600">Oxygen Saturation</div>
                
                {/* STATUS MESSAGE BOX */}
                {/* Background color changes with SpO2 value */}
                {/* Provides immediate visual feedback about health status */}
                <div className={`mt-4 p-3 rounded-lg ${spo2 >= 95 ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <p className={`text-sm font-semibold ${spo2 >= 95 ? 'text-green-800' : 'text-orange-800'}`}>
                    {spo2 >= 95 ? 'Normal Range' : 'Below Normal'}
                  </p>
                  <p className={`text-xs mt-1 ${spo2 >= 95 ? 'text-green-700' : 'text-orange-700'}`}>
                    95-100% is considered healthy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================
            ADDITIONAL HEALTH METRICS CARDS
            THREE-COLUMN GRID
            ======================================== */}
        <div className="grid md:grid-cols-3 gap-4">
          
          {/* BLOOD PRESSURE CARD */}
          {/* Shows systolic/diastolic readings */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {/* Icon background color changes based on BP value */}
                {/* Orange if elevated (systolic > 130), purple if normal */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  bloodPressure.systolic > 130 ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    bloodPressure.systolic > 130 ? 'text-orange-600' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  {/* BLOOD PRESSURE VALUES UPDATE DURING SIMULATION */}
                  {/* Format: Systolic/Diastolic (e.g., 120/80) */}
                  {/* Simulation progression:
                       - Normal: 115-122 / 75-82 mmHg
                       - Building: 120-145 / 80-95 mmHg (steady increase)
                       - Peak: 142-148 / 93-98 mmHg (highest)
                       - Plateau: 130-138 / 85-90 mmHg (stabilizing)
                       - Recovery: 138-120 / 90-80 mmHg (returning to normal)
                  */}
                  <p className="text-xl font-bold">
                    {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STEPS TODAY CARD (Dynamic - reactive to heart rate) */}
          {/* STEP COUNTER INCREASES WITH HEART RATE */}
          {/* Simulates realistic movement patterns during stress/anxiety */}
          {/* HOW STEPS CHANGE DURING SIMULATION:
               - Normal (HR 70-75): 0-2 steps per 2 seconds (minimal movement, resting)
               - Slight elevation (HR 76-90): 2-5 steps per 2 seconds (light fidgeting)
               - Building (HR 91-100): 5-10 steps per 2 seconds (pacing, restless)
               - High anxiety (HR 101-110): 10-15 steps per 2 seconds (increased pacing)
               - Peak (HR > 110): 15-20 steps per 2 seconds (rapid pacing)
               
               REALISTIC SIMULATION:
               Over 90 seconds of full simulation (normal → peak → recovery):
               - First 10s (normal): ~5-10 total steps
               - Next 20s (building): ~150-200 additional steps
               - Next 15s (peak): ~200-250 additional steps
               - Next 20s (plateau): ~150-200 additional steps
               - Recovery: Slows back down to minimal steps
               
               Total accumulated: 500-800 steps by end of episode
               This demonstrates correlation: elevated heart rate = increased movement
          */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Steps Today</p>
                  {/* DYNAMIC STEP COUNT FROM CONTEXT */}
                  {/* Updates every 2 seconds based on current heart rate */}
                  {/* Starts at 0, accumulates throughout session */}
                  {/* Never decreases - only increases with activity */}
                  <p className="text-xl font-bold">{steps}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLEEP QUALITY CARD (Static demo data) */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sleep Quality</p>
                  <p className="text-xl font-bold">7.5 hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================
            MOOD-BASED VIDEO RECOMMENDATIONS
            DYNAMICALLY CHANGES AS SIMULATION PROGRESSES
            THIS IS THE CORE INTERACTIVE FEATURE
            ======================================== */}
        <Card>
          <CardHeader>
            <CardTitle>Videos based on your Mood</CardTitle>
            {/* DYNAMIC MESSAGE - CHANGES WITH MOOD STATE */}
            {/* getMoodMessage() returns different text for each mood:
                 - calm: "You're feeling great! Here are some videos to maintain your wellness"
                 - slightly-anxious: "Feeling a bit tense? These videos can help you relax"
                 - anxious: "We noticed elevated stress. Try these immediate relief techniques"
                 - recovering: "Great progress! Here are recovery-focused videos for you"
                
                HOW THIS UPDATES DURING SIMULATION:
                1. Seconds 0-10 (Normal phase, HR 70-75): Shows "feeling great" message with wellness videos
                2. Seconds 10-30 (Building phase, HR 75-105): Message changes to "feeling tense", shows breathing exercises
                3. Seconds 30-65 (Peak/Plateau, HR 105-112): Message changes to "elevated stress", shows emergency techniques
                4. Seconds 65+ (Recovery, HR decreasing): Message changes to "great progress", shows recovery content
            */}
            <p className="text-sm text-gray-600">{getMoodMessage()}</p>
          </CardHeader>
          <CardContent>
            {/* Horizontal scrolling container for video cards */}
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4">
                {/* MAP THROUGH VIDEO ARRAY */}
                {/* The 'videos' variable changes when mood changes */}
                {/* React automatically re-renders this section when videos array updates */}
                {/* 
                    SIMULATION FLOW DEMONSTRATION:
                    
                    TIME 0-10s (mood='calm'):
                    - videos = 4 calm videos (meditation, stretching, nature, walking)
                    
                    TIME 10-30s (mood='slightly-anxious'):
                    - Component re-renders automatically
                    - videos = 4 slightly anxious videos (5-min breathing, yoga, muscle relaxation, meditation)
                    - User sees different video cards appear
                    
                    TIME 30-65s (mood='anxious'):
                    - Component re-renders again
                    - videos = 4 anxious videos (emergency technique, 4-7-8 breathing, grounding, quick relief)
                    - User sees urgent/emergency content
                    
                    TIME 65+ (mood='recovering'):
                    - Component re-renders
                    - videos = 4 recovery videos (restoration, self-care yoga, visualization, restorative breathing)
                    - User sees recovery-focused content
                */}
                {videos.map((video, index) => (
                  <div key={index} className="w-[280px] flex-shrink-0">
                    {/* VideoCard component - clickable, opens YouTube in new tab */}
                    {/* Spread operator {...video} passes all video properties as props */}
                    <VideoCard {...video} />
                  </div>
                ))}
              </div>
              {/* Horizontal scrollbar */}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      {/* ========================================
          BOTTOM MOBILE NAVIGATION BAR
          FIXED AT BOTTOM ON MOBILE DEVICES
          ======================================== */}
      {/* Hidden on desktop (md:hidden), visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4">
          {/* Map through same navigation items as hamburger menu */}
          {/* Ensures consistency between navigation methods */}
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-3 text-xs hover:bg-gray-50"
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ========================================
   SUMMARY OF STRESS SIMULATION IN UI
   ======================================== 
   
   This dashboard demonstrates the stress simulation through multiple synchronized elements:
   
   1. HEART RATE GAUGE (Most Visible)
      - Needle position changes every 2 seconds
      - Starts at ~72 BPM (green zone)
      - Gradually moves into yellow zone (80-100 BPM)
      - Enters red zone (>100 BPM) during anxiety
      - Returns to green during recovery
   
   2. ALERT CARDS (Conditional Visibility)
      - Green "All Normal" shows when healthy
      - Disappears when heart rate rises above 80
      - Orange "High BP" warning appears at HR > 100
      - Provides actionable navigation to danger check
   
   3. STATUS INDICATOR (Visual Confirmation)
      - Green checkmark banner shows when all vitals normal
      - Disappears when any vital becomes abnormal
      - Reappears during recovery
   
   4. SPO2 DISPLAY (Secondary Indicator)
      - Number changes color (blue → orange) when low
      - Status message updates ("Normal" → "Below Normal")
      - Background color shifts for visual feedback
   
   5. BLOOD PRESSURE (Tertiary Indicator)
      - Numbers update showing systolic/diastolic
      - Icon background color changes (purple → orange)
   
   6. VIDEO RECOMMENDATIONS (Contextual Response)
      - Entire section updates with new videos
      - Message above videos changes to match mood
      - Content becomes more urgent as stress increases
      - Returns to wellness content during recovery
   
   ALL THESE CHANGES HAPPEN AUTOMATICALLY WITHOUT USER INPUT
   The simulation runs continuously in the background via HealthProvider
   React's reactivity ensures UI updates immediately when context values change
*/