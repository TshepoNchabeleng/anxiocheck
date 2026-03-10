import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Menu, Home, FileText, Activity, Database, LogOut, Search, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useHealth } from "../context/health-context";

export default function Data() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter data based on search term
  const filteredHistory = history.filter((entry) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.heartRate.toString().includes(searchLower) ||
      entry.spo2.toString().includes(searchLower) ||
      entry.timestamp.toLocaleString().toLowerCase().includes(searchLower)
    );
  });

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
            <h2 className="text-2xl font-bold text-gray-900">Data Analytics</h2>
            <p className="text-gray-600 mt-1">Detailed view of all your health metrics</p>
          </div>
          <Database className="w-8 h-8 text-blue-600" />
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by heart rate, SpO2, or time..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-3xl font-bold mt-1">{history.length}</p>
              <p className="text-xs text-gray-500 mt-2">Data points collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Monitoring Duration</p>
              <p className="text-3xl font-bold mt-1">{Math.round(history.length * 10 / 60)}</p>
              <p className="text-xs text-gray-500 mt-2">Minutes of tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Data Quality</p>
              <p className="text-3xl font-bold mt-1 text-green-600">100%</p>
              <p className="text-xs text-gray-500 mt-2">No missing readings</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Health Data Log</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? "No results found" : "No data available yet"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {searchTerm ? "Try adjusting your search terms" : "Keep monitoring to collect health data"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">#</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Date & Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Heart Rate</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">SpO2</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Blood Pressure</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((entry, index) => {
                      const isNormal = entry.heartRate <= 100 && entry.spo2 >= 95 && entry.bloodPressure.systolic <= 130;
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                          <td className="py-3 px-4 text-sm">
                            <div>{entry.timestamp.toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{entry.timestamp.toLocaleTimeString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${entry.heartRate > 100 ? 'text-red-600' : 'text-green-600'}`}>
                              {entry.heartRate} BPM
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${entry.spo2 < 95 ? 'text-orange-600' : 'text-blue-600'}`}>
                              {entry.spo2}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${entry.bloodPressure.systolic > 130 ? 'text-orange-600' : 'text-gray-900'}`}>
                              {entry.bloodPressure.systolic}/{entry.bloodPressure.diastolic}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isNormal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {isNormal ? 'Normal' : 'Alert'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Options */}
        {history.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Export This Data</p>
                  <p className="text-sm text-gray-600">Download your complete health data for analysis</p>
                </div>
                <Link to="/report">
                  <Button variant="outline">
                    Go to Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
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
