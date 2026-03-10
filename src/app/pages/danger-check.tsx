import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, ArrowLeft, Phone, MapPin, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useHealth } from "../context/health-context";

export default function DangerCheck() {
  const navigate = useNavigate();
  const [response, setResponse] = useState<"danger" | "safe" | null>(null);
  const { bloodPressure, resetToCalm } = useHealth();

  const handleDanger = () => {
    setResponse("danger");
  };

  const handleSafe = () => {
    resetToCalm();
    navigate("/survey");
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-[#121212] transition-colors duration-300">
      <header className="bg-white dark:bg-[#1a1a1a] border-b dark:border-white/10 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Health Alert Assessment</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {!response ? (
          <>
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-orange-900">High Blood Pressure Detected (Version 1)</CardTitle>
                    <p className="text-sm text-orange-700 mt-1">
                      Your current reading: {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)} mmHg
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Are you in danger?</CardTitle>
                <p className="text-center text-gray-600 mt-2">
                  Please assess your current condition and let us know if you need immediate assistance
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="h-20 text-lg"
                    onClick={handleDanger}
                  >
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    YES - I need help
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-20 text-lg"
                    onClick={handleSafe}
                  >
                    <Heart className="w-6 h-6 mr-2" />
                    NO - I'm feeling okay
                  </Button>
                </div>
              </CardContent>
            </Card>

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
          <>
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

                <div className="space-y-3">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full h-16 text-lg"
                    onClick={() => navigate("/emergency")}
                  >
                    <Phone className="w-6 h-6 mr-2" />
                    Activate Emergency Protocol
                  </Button>

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

                <div className="bg-white rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-sm">While waiting for help:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Sit down in a comfortable position</li>
                    <li>• Loosen any tight clothing</li>
                    <li>• Try to stay calm and breathe slowly</li>
                    <li>• Don't eat or drink anything</li>
                  </ul>
                </div>

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
          <>
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

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">Immediate Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Sit down and rest for 15-20 minutes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Drink a glass of water</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Practice deep breathing exercises</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Avoid caffeine and salty foods</span>
                    </div>
                  </CardContent>
                </Card>

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

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/dashboard")}
                  >
                    Return to Dashboard
                  </Button>
                  
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
