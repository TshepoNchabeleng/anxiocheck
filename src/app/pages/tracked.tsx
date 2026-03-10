import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Menu, Home, FileText, Activity, Database, LogOut, Heart, Droplet, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useHealth } from "../context/health-context";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Tracked() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userName = localStorage.getItem("userName") || "User";
  const { history } = useHealth();

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

  const chartData = history.map((entry, index) => ({
    time: entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: entry.heartRate,
    spo2: entry.spo2,
    systolic: entry.bloodPressure.systolic,
  }));

  const stats = {
    avgHeartRate: history.length > 0 
      ? Math.round(history.reduce((sum, entry) => sum + entry.heartRate, 0) / history.length)
      : 0,
    maxHeartRate: history.length > 0
      ? Math.max(...history.map(entry => entry.heartRate))
      : 0,
    minHeartRate: history.length > 0
      ? Math.min(...history.map(entry => entry.heartRate))
      : 0,
    avgSpo2: history.length > 0
      ? Math.round(history.reduce((sum, entry) => sum + entry.spo2, 0) / history.length)
      : 0,
  };

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
            <h2 className="text-2xl font-bold text-gray-900">Tracked Vitals</h2>
            <p className="text-gray-600 mt-1">Monitor your health trends over time</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Heart Rate</p>
                  <p className="text-xl font-bold">{stats.avgHeartRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Max Heart Rate</p>
                  <p className="text-xl font-bold">{Math.round(stats.maxHeartRate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Min Heart Rate</p>
                  <p className="text-xl font-bold">{Math.round(stats.minHeartRate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg SpO2</p>
                  <p className="text-xl font-bold">{stats.avgSpo2}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {chartData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[60, 120]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Heart Rate (BPM)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tracking data available yet</p>
              <p className="text-sm text-gray-400 mt-2">Keep the app running to see your vitals tracked over time</p>
            </CardContent>
          </Card>
        )}

        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Blood Oxygen (SpO2) Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[90, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="spo2" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="SpO2 (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure (Systolic) Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis domain={[100, 160]} />
                  <XAxis dataKey="time" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Systolic (mmHg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
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