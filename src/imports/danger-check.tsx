// Import useState hook for managing the user's response selection
import { useState } from "react";

// Import useNavigate for programmatic navigation back to dashboard
import { useNavigate } from "react-router";

// Import icons for visual elements
import { AlertTriangle, ArrowLeft, Phone, MapPin, Heart } from "lucide-react";

// Import UI components
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// Import health context to access real-time vitals and trigger recovery
import { useHealth } from "../context/health-context";

// DangerCheck component - Emergency assessment page users reach when high BP alert is clicked
// PURPOSE: Determine if user is in real danger and guide appropriate response
// CRITICAL: This page can trigger the simulation to enter recovery phase
export default function DangerCheck() {
  const navigate = useNavigate();
  
  // ========================================
  // STATE: User's Self-Assessment Response
  // ========================================
  // null = Initial state, showing question
  // "danger" = User needs help, show emergency contacts
  // "safe" = User is okay, show self-care tips and TRIGGER RECOVERY
  const [response, setResponse] = useState<"danger" | "safe" | null>(null);
  
  // ========================================
  // ACCESS REAL-TIME HEALTH DATA & RECOVERY FUNCTION
  // ========================================
  // bloodPressure: Current BP values to display in alert header
  // resetToCalm: Function to initiate recovery phase of simulation
  //              When called, jumps simulation to recovery phase
  //              Heart rate will begin decreasing back to 72 BPM
  //              This demonstrates stress regulation after self-assessment
  const { bloodPressure, resetToCalm } = useHealth();

  // ========================================
  // HANDLER: User Indicates They Are In Danger
  // ========================================
  // Sets response to "danger" which shows emergency contact options
  // Does NOT trigger recovery - user needs immediate help
  const handleDanger = () => {
    setResponse("danger");
  };

  // ========================================
  // HANDLER: User Indicates They Are Safe
  // CRITICAL: THIS TRIGGERS SIMULATION RECOVERY
  // ========================================
  // When user clicks "NO - I'm feeling okay":
  // 1. Shows safe/self-care recommendations
  // 2. After 2 second delay, calls resetToCalm()
  // 3. Simulation enters recovery phase
  // 4. Heart rate begins decreasing: 105+ → 100 → 90 → 80 → 72
  // 5. Alert dismisses automatically when HR ≤ 100
  // 6. Videos change to recovery content
  // 7. SpO2 increases back to 97-98%
  // 8. Blood pressure decreases to normal range
  //
  // This simulates successful stress regulation through self-awareness
  const handleSafe = () => {
    setResponse("safe"); // Show self-care recommendations
    
    // Delay recovery start by 2 seconds so user can see the response
    setTimeout(() => {
      resetToCalm(); // TRIGGER RECOVERY PHASE
      // After this call:
      // - simulationPhase changes from 'peak'/'plateau' to 'recovery'
      // - elapsedTime jumps to 65 (recovery start point)
      // - Heart rate begins gradual decrease in health-context.tsx
      // - All pages see this change immediately via context
    }, 2000);
  };

  // Handle emergency call button
  // In production, this would integrate with actual emergency services
  const handleEmergencyCall = () => {
    // Mock emergency call - would trigger real services in production
    alert("Emergency services would be contacted in a real application");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ========================================
          HEADER WITH BACK BUTTON
          ======================================== */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          {/* Back button returns to dashboard */}
          {/* IMPORTANT: Simulation continues running when user goes back */}
          {/* If recovery was triggered, they'll see HR decreasing on dashboard */}
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Health Alert Assessment</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* ========================================
            CONDITIONAL RENDERING BASED ON RESPONSE STATE
            Three possible views: Question, Danger Response, Safe Response
            
            VIEW 1: INITIAL QUESTION (response === null)
            VIEW 2: EMERGENCY RESPONSE (response === "danger")
            VIEW 3: SAFE RESPONSE (response === "safe")
            ======================================== */}
        
        {!response ? (
          // VIEW 1: INITIAL QUESTION
          <>
            {/* ALERT HEADER WITH REAL-TIME BP VALUES */}
            {/* Orange background indicates warning/caution state */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-orange-900">High Blood Pressure Detected</CardTitle>
                    
                    {/* REAL-TIME BLOOD PRESSURE DISPLAY */}
                    {/* These values continue updating from context every 2 seconds */}
                    {/* Even while user reads this page, simulation continues */}
                    {/* Math.round() converts decimals to whole numbers (145.7 → 146) */}
                    {/* During peak phase: Shows values like 145/95, 148/97, 142/94 */}
                    {/* If user delays, they might see values start decreasing as plateau begins */}
                    <p className="text-sm text-orange-700 mt-1">
                      Your current reading: {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)} mmHg
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* ========================================
                QUESTION CARD - BINARY CHOICE
                ======================================== */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Are you in danger?</CardTitle>
                <p className="text-center text-gray-600 mt-2">
                  Please assess your current condition and let us know if you need immediate assistance
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  
                  {/* DANGER BUTTON (Red/Destructive) */}
                  {/* User clicks if experiencing severe symptoms */}
                  {/* Shows emergency contact options */}
                  {/* Does NOT trigger recovery - situation is urgent */}
                  <Button
                    size="lg"
                    variant="destructive" // Red styling for urgency
                    className="h-20 text-lg"
                    onClick={handleDanger}
                  >
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    YES - I need help
                  </Button>
                  
                  {/* SAFE BUTTON (Outlined) */}
                  {/* User clicks if they're managing okay despite high reading */}
                  {/* Shows self-care recommendations */}
                  {/* TRIGGERS RECOVERY PHASE - simulates successful stress management */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-20 text-lg"
                    onClick={handleSafe} // Calls handleSafe which triggers resetToCalm()
                  >
                    <Heart className="w-6 h-6 mr-2" />
                    NO - I'm feeling okay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SYMPTOMS CHECKLIST */}
            {/* Helps user make informed decision */}
            {/* Lists warning signs that indicate need for emergency help */}
            <Card>
              <CardHeader>
                <CardTitle>Common Warning Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Severe chest pain or pressure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Difficulty breathing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Sudden severe headache</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Vision problems or dizziness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Numbness or weakness</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        
        ) : response === "danger" ? (
          // VIEW 2: EMERGENCY RESPONSE
          <>
            {/* Red-themed emergency card */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 text-center text-2xl">
                  Emergency Assistance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-red-800">
                  Stay calm. Help is on the way. We're alerting your emergency contacts and nearby medical services.
                </p>

                {/* EMERGENCY ACTIONS */}
                <div className="space-y-3">
                  
                  {/* Emergency call button */}
                  {/* In production, would dial emergency services */}
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full h-16 text-lg"
                    onClick={handleEmergencyCall}
                  >
                    <Phone className="w-6 h-6 mr-2" />
                    Call Emergency Services
                  </Button>

                  {/* Location sharing indicator */}
                  {/* Shows user their location is being shared */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-semibold text-sm">Your Location</p>
                          <p className="text-xs text-gray-600">Sharing with emergency services...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* WHILE WAITING INSTRUCTIONS */}
                {/* Provides immediate guidance while help is coming */}
                <div className="bg-white rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-sm">While waiting for help:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Sit down in a comfortable position</li>
                    <li>• Loosen any tight clothing</li>
                    <li>• Try to stay calm and breathe slowly</li>
                    <li>• Don't eat or drink anything</li>
                  </ul>
                </div>

                {/* Return button - simulation continues regardless */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          </>
        
        ) : (
          // VIEW 3: SAFE RESPONSE
          <>
            {/* Green-themed reassurance card */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900 text-center text-2xl">
                  Good to hear you're okay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-green-800">
                  While you're not in immediate danger, your blood pressure is elevated. Here are some recommendations:
                </p>

                {/* ========================================
                    IMMEDIATE SELF-CARE ACTIONS
                    These recommendations align with recovery simulation
                    ======================================== */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">Immediate Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {/* Rest recommendation */}
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Sit down and rest for 15-20 minutes</span>
                    </div>
                    {/* Hydration */}
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Drink a glass of water</span>
                    </div>
                    {/* Breathing exercises - aligns with recovery videos */}
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Practice deep breathing exercises</span>
                    </div>
                    {/* Dietary caution */}
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Avoid caffeine and salty foods</span>
                    </div>
                  </CardContent>
                </Card>

                {/* ========================================
                    WHEN TO SEEK FURTHER HELP
                    Educational guidance for user
                    ======================================== */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">When to Seek Help</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700">
                    <p>Contact your doctor if:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Your BP remains above 140/90 for several readings</li>
                      <li>• You experience any warning signs</li>
                      <li>• Symptoms worsen or don't improve</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* ========================================
                    NAVIGATION BUTTONS
                    ======================================== */}
                <div className="flex gap-3">
                  {/* Return to dashboard button */}
                  {/* IMPORTANT: When user returns to dashboard after clicking this,
                       they will see:
                       - Heart rate decreasing (recovery phase active)
                       - Alert dismissed once HR ≤ 100
                       - Videos changed to "recovering" mood
                       - SpO2 increasing back to normal
                       - All metrics returning to baseline
                       
                       This demonstrates the simulation continuing in background
                       and responding to user's self-assessment action
                  */}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/dashboard")}
                  >
                    Return to Dashboard
                  </Button>
                  
                  {/* Re-assessment button */}
                  {/* Resets response to null, shows question again */}
                  {/* Useful if user's condition changes */}
                  <Button
                    className="flex-1"
                    onClick={() => setResponse(null)}
                  >
                    Re-assess Condition
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

/* ========================================
   SIMULATION INTERACTION SUMMARY
   ======================================== 
   
   This page demonstrates critical interaction with the stress simulation:
   
   TRIGGER CONDITION:
   - User clicks high BP alert on dashboard (when HR > 100 BPM)
   - Typically happens around second 15-20 of simulation
   - During building or peak phase of anxiety
   
   REAL-TIME DISPLAY:
   - Blood pressure values continue updating while user reads
   - Shows actual current BP from simulation
   - Updates every 2 seconds from context
   
   USER DECISION POINT:
   Two paths based on self-assessment:
   
   PATH 1: "YES - I need help"
   - Shows emergency contact options
   - Simulation continues at current phase
   - Heart rate stays elevated
   - Alert remains on dashboard
   - User can get help while vitals monitored
   
   PATH 2: "NO - I'm feeling okay" (THE CRITICAL PATH)
   - Shows self-care recommendations
   - Calls resetToCalm() after 2 seconds
   - Simulation IMMEDIATELY jumps to recovery phase
   - Heart rate begins decreasing
   - Alert will dismiss when HR ≤ 100
   - Videos change to recovery content
   - Demonstrates successful stress management
   
   RETURN TO DASHBOARD:
   - Simulation has progressed while user was on this page
   - If recovery triggered, user sees:
     * Decreasing heart rate
     * Alert dismissed
     * "Great progress!" message with recovery videos
     * All vitals returning to normal
   
   THIS INTERACTION DEMONSTRATES:
   1. Real-time monitoring continues across pages
   2. User actions can influence simulation state
   3. Self-awareness and assessment can trigger recovery
   4. System responds appropriately to user's condition
   5. Background health tracking never stops
   
   EDUCATIONAL VALUE:
   Shows users that acknowledging and managing stress
   (clicking "I'm feeling okay") initiates actual physiological
   recovery - teaching the mind-body connection
*/