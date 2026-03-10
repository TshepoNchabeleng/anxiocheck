import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Menu, Home, FileText, Activity, Database, LogOut, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useHealth } from "../context/health-context";

export default function Report() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userName = localStorage.getItem("userName") || "User";
  
  // ========================================
  // ACCESS REAL-TIME HEALTH DATA
  // ========================================
  // Get current vitals AND historical data from context
  // - heartRate, spo2, bloodPressure: CURRENT values (update every 2 seconds)
  // - history: Array of past readings (recorded every 10 seconds)
  //
  // SIMULATION TRACKING:
  // Even as user browses different pages, history continues accumulating
  // By the time they visit Report page:
  // - If 30 seconds passed: ~3 history entries
  // - If 2 minutes passed: ~12 history entries
  // - If 8 minutes passed: ~48 history entries (approaching 50 max)
  const { heartRate, spo2, bloodPressure, history } = useHealth();

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const navigationItems = [
    { icon: Home, label: "HOME", path: "/dashboard" },
    { icon: FileText, label: "REPORT", path: "/report" },
    { icon: Activity, label: "TRACKED", path: "/tracked" },
    { icon: Database, label: "DATA", path: "/data" },
  ];

  // ========================================
  // DOWNLOAD REPORT FUNCTIONALITY
  // ========================================
  // Creates a text file containing:
  // 1. Current snapshot of vitals
  // 2. Complete history of all recorded data
  // 3. Recommendations based on current values
  //
  // DEMONSTRATES: How simulation data can be exported for records
  const downloadReport = (format: 'pdf' | 'csv') => {
    // ========================================
    // BUILD REPORT CONTENT STRING
    // ========================================
    // Template literal creates multi-line text file
    // Embeds live values from simulation state
    const reportData = `
ANXIOCHECK Health Report
Generated: ${new Date().toLocaleString()} // Timestamp of report generation
Patient: ${userName} // Personalized with user's name

=== CURRENT VITALS ===
// These are the CURRENT values at moment of download
// If downloaded during peak: Shows HR ~110, SpO2 ~93, BP ~145/95
// If downloaded during recovery: Shows decreasing values
Heart Rate: ${Math.round(heartRate)} BPM
Blood Oxygen (SpO2): ${Math.round(spo2)}%
Blood Pressure: ${Math.round(bloodPressure.systolic)}/${Math.round(bloodPressure.diastolic)} mmHg

=== SUMMARY ===
Total Records: ${history.length} // Number of data points collected
Monitoring Period: Last ${Math.round(history.length * 10 / 60)} minutes // Convert to minutes

=== RECOMMENDATIONS ===
// Dynamic recommendations based on CURRENT values
// Messages change depending on simulation state when downloaded
${heartRate > 100 ? '⚠️ Elevated heart rate detected. Consider relaxation techniques.' : '✓ Heart rate is within normal range.'}
${spo2 < 95 ? '⚠️ Blood oxygen below optimal. Ensure proper breathing.' : '✓ Blood oxygen levels are healthy.'}
${bloodPressure.systolic > 130 ? '⚠️ Blood pressure is elevated. Monitor closely.' : '✓ Blood pressure is within normal range.'}

=== DETAILED HISTORY ===
// Loop through all history entries and format each one
// This captures the entire journey through the simulation
// Shows progression: normal → building → peak → plateau → recovery
${history.map((entry, i) => `
Record ${i + 1} - ${entry.timestamp.toLocaleTimeString()}
  Heart Rate: ${entry.heartRate} BPM
  SpO2: ${entry.spo2}%
  Blood Pressure: ${entry.bloodPressure.systolic}/${entry.bloodPressure.diastolic} mmHg
`).join('\n')}

---
This report is for informational purposes only and does not replace professional medical advice.
© ANXIOCHECK
    `;

    // ========================================
    // CREATE AND DOWNLOAD FILE
    // ========================================
    // Create Blob (Binary Large Object) containing the text data
    const blob = new Blob([reportData], { type: 'text/plain' });
    
    // Create temporary URL pointing to the blob
    const url = URL.createObjectURL(blob);
    
    // Create invisible anchor element for download
    const a = document.createElement('a');
    a.href = url;
    
    // Set filename with current date
    a.download = `ANXIOCHECK_Report_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'txt' : 'csv'}`;
    
    // Add to DOM (required for Firefox)
    document.body.appendChild(a);
    
    // Programmatically click to trigger download
    a.click();
    
    // Cleanup: Remove element from DOM
    document.body.removeChild(a);
    
    // Cleanup: Release blob URL to free memory
    URL.revokeObjectURL(url);
  };

  // ========================================
  // CALCULATE HEART RATE TREND
  // ========================================
  // Compares recent readings to earlier readings to show trend direction
  // DEMONSTRATES: How historical data enables trend analysis
  const getHeartRateTrend = () => {
    // Need at least 2 entries to calculate trend
    if (history.length < 2) return null;
    
    // Calculate average of last 5 readings (most recent)
    // slice(-5) gets last 5 items from array
    // reduce() sums all heart rates, then divide by count
    const recent = history.slice(-5).reduce((sum, entry) => sum + entry.heartRate, 0) / Math.min(5, history.length);
    
    // Calculate average of first 5 readings (earliest)
    // slice(0, 5) gets first 5 items from array
    const earlier = history.slice(0, 5).reduce((sum, entry) => sum + entry.heartRate, 0) / Math.min(5, history.length);
    
    // Compare averages to determine trend direction
    // During building/peak: recent > earlier = 'up' (increasing trend)
    // During recovery: recent < earlier = 'down' (decreasing trend)
    return recent > earlier ? 'up' : 'down';
  };

  // Get trend value - used to show trending up/down arrow
  const trend = getHeartRateTrend();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>ANXIOCHECK</SheetTitle>
                <SheetDescription>Navigate through your health dashboard</SheetDescription>
              </SheetHeader>
              <nav className="mt-8">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
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

          <h1 className="text-xl font-bold">ANXIOCHECK</h1>
          
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Health Reports</h2>
            <p className="text-gray-600 mt-1">View and download your health data</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>

        {/* Current Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Heart Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{Math.round(heartRate)}</p>
                  <span className="text-sm text-gray-600">BPM</span>
                  {trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                  {trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                </div>
                <p className={`text-sm ${heartRate > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {heartRate > 100 ? 'Elevated' : 'Normal'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Blood Oxygen (SpO2)</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{Math.round(spo2)}</p>
                  <span className="text-sm text-gray-600">%</span>
                </div>
                <p className={`text-sm ${spo2 < 95 ? 'text-orange-600' : 'text-green-600'}`}>
                  {spo2 < 95 ? 'Below Optimal' : 'Healthy'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Blood Pressure</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">
                    {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)}
                  </p>
                </div>
                <p className={`text-sm ${bloodPressure.systolic > 130 ? 'text-orange-600' : 'text-green-600'}`}>
                  {bloodPressure.systolic > 130 ? 'Elevated' : 'Normal'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Export your health data for your records or to share with your healthcare provider
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => downloadReport('pdf')} className="gap-2">
                <Download className="w-4 h-4" />
                Download as TXT
              </Button>
              <Button onClick={() => downloadReport('csv')} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download as CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No activity recorded yet. Keep monitoring to see your health trends!</p>
              ) : (
                history.slice(-10).reverse().map((entry, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{entry.timestamp.toLocaleTimeString()}</p>
                      <p className="text-sm text-gray-600">{entry.timestamp.toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="font-semibold">{entry.heartRate}</span> BPM • 
                        <span className="font-semibold ml-1">{entry.spo2}</span>% • 
                        <span className="font-semibold ml-1">{entry.bloodPressure.systolic}/{entry.bloodPressure.diastolic}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4">
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
   HOW INFO TABS CHANGE DURING SIMULATION
   ======================================== 
   
   This Report page demonstrates real-time data display across simulation phases:
   
   PHASE 1: NORMAL (0-10 seconds, HR 70-75 BPM)
   - Current Status shows: HR 72, SpO2 98%, BP 120/80
   - Status text: "Normal" (green)
   - Trend arrow: None (insufficient data) or horizontal
   - History: 0-1 entries
   - Download report shows normal recommendations
   
   PHASE 2: BUILDING (10-30 seconds, HR 75-105 BPM)
   - Current Status updates: HR increasing (80...85...90...95...100)
   - SpO2 decreasing: 97...96...95...94%
   - BP rising: 125/82...130/85...135/88...140/92
   - Status changes to "Elevated" (orange/red) when HR > 100
   - Trend arrow: TrendingUp (red) appears
   - History: 2-3 entries showing progression
   - Download report begins showing warning recommendations
   
   PHASE 3: PEAK (30-45 seconds, HR 105-112 BPM)
   - Current Status shows: HR 108, SpO2 93%, BP 145/95
   - All status indicators RED/ORANGE
   - Trend arrow: TrendingUp (red)
   - History: 3-4 entries capturing peak
   - Download report shows multiple warnings
   
   PHASE 4: PLATEAU (45-65 seconds, HR 95-100 BPM)
   - Current Status: HR stabilizing around 97-100
   - SpO2 improving: 93...94...95%
   - BP stabilizing: 138/88...135/87...132/86
   - Some indicators returning to normal
   - Trend arrow: May show TrendingDown (green)
   - History: 5-6 entries showing stabilization
   
   PHASE 5: RECOVERY (65+ seconds, HR 100→72 BPM)
   - Current Status: All values decreasing
   - HR: 95...90...85...80...75...72
   - SpO2: 96...97...98%
   - BP: 128/84...122/80...120/79
   - Status returns to "Normal" (green)
   - Trend arrow: TrendingDown (green)
   - History: 7+ entries showing full recovery curve
   - Download report shows normal recommendations again
   
   KEY DEMONSTRATION FEATURES:
   
   1. LIVE VALUE UPDATES
      - Numbers change every 2 seconds as user watches
      - Color-coded status indicators respond immediately
      - Trend arrows reflect historical pattern
   
   2. HISTORICAL DATA ACCUMULATION
      - Recent Activity section grows over time
      - Shows last 10 entries in reverse chronological order
      - Each entry captures exact timestamp and all vitals
      - User can see their journey through the episode
   
   3. CONTEXTUAL RECOMMENDATIONS
      - Download report contains different advice based on current state
      - During peak: Multiple warnings, urgent recommendations
      - During recovery: Positive feedback, preventive tips
      - Shows how same report feature adapts to user condition
   
   4. TREND ANALYSIS
      - Compares early data to recent data
      - Up arrow: Stress building
      - Down arrow: Recovery in progress
      - Teaches users to recognize patterns
   
   5. CROSS-PAGE CONSISTENCY
      - Data continues accumulating if user visits other pages
      - Return to Report shows all data collected during absence
      - Demonstrates persistent background monitoring
   
   EDUCATIONAL VALUE:
   - Users see how health metrics correlate
   - High HR correlates with low SpO2 and high BP
   - Recovery shows all metrics improving together
   - Historical view shows patterns over time
   - Download capability encourages health tracking habits
*/