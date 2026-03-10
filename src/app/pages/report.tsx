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

  const downloadReport = (format: 'pdf' | 'csv') => {
    const reportData = `
ANXIOCHECK Health Report
Generated: ${new Date().toLocaleString()}
Patient: ${userName}

=== CURRENT VITALS ===
Heart Rate: ${Math.round(heartRate)} BPM
Blood Oxygen (SpO2): ${Math.round(spo2)}%
Blood Pressure: ${Math.round(bloodPressure.systolic)}/${Math.round(bloodPressure.diastolic)} mmHg

=== SUMMARY ===
Total Records: ${history.length}
Monitoring Period: Last ${Math.round(history.length * 10 / 60)} minutes

=== RECOMMENDATIONS ===
${heartRate > 100 ? '⚠️ Elevated heart rate detected. Consider relaxation techniques.' : '✓ Heart rate is within normal range.'}
${spo2 < 95 ? '⚠️ Blood oxygen below optimal. Ensure proper breathing.' : '✓ Blood oxygen levels are healthy.'}
${bloodPressure.systolic > 130 ? '⚠️ Blood pressure is elevated. Monitor closely.' : '✓ Blood pressure is within normal range.'}

=== DETAILED HISTORY ===
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

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ANXIOCHECK_Report_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'txt' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getHeartRateTrend = () => {
    if (history.length < 2) return null;
    
    const recent = history.slice(-5).reduce((sum, entry) => sum + entry.heartRate, 0) / Math.min(5, history.length);
    const earlier = history.slice(0, 5).reduce((sum, entry) => sum + entry.heartRate, 0) / Math.min(5, history.length);
    
    return recent > earlier ? 'up' : 'down';
  };

  const trend = getHeartRateTrend();

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-[#121212] transition-colors duration-300">
      <header className="bg-white dark:bg-[#1a1a1a] border-b dark:border-white/10 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white dark:bg-[#1a1a1a] border-r-black/10 dark:border-r-white/10 text-slate-900 dark:text-white">
              <SheetHeader>
                <SheetTitle className="text-slate-900 dark:text-white">ANXIOCHECK</SheetTitle>
                <SheetDescription className="text-slate-500 dark:text-gray-400">Navigate through your health dashboard</SheetDescription>
              </SheetHeader>
              <nav className="mt-8">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5 text-slate-600 dark:text-gray-300" />
                        <span className="font-semibold text-slate-700 dark:text-gray-200">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    SIGN OUT
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white">ANXIOCHECK</h1>
          
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Health Reports</h2>
            <p className="text-gray-600 mt-1">View and download your health data</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>

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