import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, Activity, ZoomIn, ZoomOut, Award, Menu, LogOut, Home, FileText, Database, Smile, Baby, Sparkles, Watch, AlertTriangle, ChevronRight, Check, Calculator } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";
import { useHealth } from "../context/health-context";
import { AlertCard } from "../components/alert-card";
import { VideoCard } from "../components/video-card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";

type TimeScale = "Today" | "Week" | "Month" | "Year";

const mockData = {
  Today: [
    { time: "6am", actual: 58, baseline: 75 },
    { time: "7am", actual: 64, baseline: 75 },
    { time: "8am", actual: 71, baseline: 75 },
    { time: "9am", actual: 76, baseline: 75 },
    { time: "10am", actual: 82, baseline: 75 },
    { time: "11am", actual: 88, baseline: 75 },
    { time: "12pm", actual: 91, baseline: 75 },
    { time: "1pm", actual: 94, baseline: 75 },
    { time: "2pm", actual: 96, baseline: 75 },
    { time: "3pm", actual: 93, baseline: 75 },
    { time: "4pm", actual: 87, baseline: 75 },
    { time: "5pm", actual: 81, baseline: 75 },
    { time: "6pm", actual: 77, baseline: 75 },
    { time: "7pm", actual: 73, baseline: 75 },
    { time: "8pm", actual: 68, baseline: 75 },
    { time: "9pm", actual: 62, baseline: 75 },
  ],
  Week: [
    { time: "Mon", actual: 68, baseline: 75 },
    { time: "Tue", actual: 74, baseline: 75 },
    { time: "Wed", actual: 82, baseline: 75 },
    { time: "Thu", actual: 91, baseline: 75 },
    { time: "Fri", actual: 85, baseline: 75 },
    { time: "Sat", actual: 72, baseline: 75 },
    { time: "Sun", actual: 64, baseline: 75 },
  ],
  Month: [
    { time: "Week 1", actual: 72, baseline: 75 },
    { time: "Week 2", actual: 84, baseline: 75 },
    { time: "Week 3", actual: 92, baseline: 75 },
    { time: "Week 4", actual: 76, baseline: 75 },
  ],
  Year: [
    { time: "Jan", actual: 70, baseline: 75 },
    { time: "Feb", actual: 73, baseline: 75 },
    { time: "Mar", actual: 78, baseline: 75 },
    { time: "Apr", actual: 84, baseline: 75 },
    { time: "May", actual: 89, baseline: 75 },
    { time: "Jun", actual: 82, baseline: 75 },
    { time: "Jul", actual: 74, baseline: 75 },
    { time: "Aug", actual: 71, baseline: 75 },
    { time: "Sep", actual: 79, baseline: 75 },
    { time: "Oct", actual: 86, baseline: 75 },
    { time: "Nov", actual: 81, baseline: 75 },
    { time: "Dec", actual: 75, baseline: 75 },
  ],
};

export default function LevelsPage() {
  const navigate = useNavigate();
  const [timeScale, setTimeScale] = useState<TimeScale>("Today");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showTour, setShowTour] = useState(() => {
    return localStorage.getItem("hasSeenTour") !== "true";
  });
  const [tourStep, setTourStep] = useState(0);
  
  const { heartRate, showHighBPAlert, mood } = useHealth();
  const [dynamicData, setDynamicData] = useState(mockData.Today);
  
  const navigationItems = [
    { icon: Home, label: "HOME", path: "/dashboard" },
    { icon: FileText, label: "REPORT", path: "/report" },
    { icon: Activity, label: "TRACKED", path: "/tracked" },
    { icon: Database, label: "DATA", path: "/data" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleCompleteTour = () => {
    localStorage.setItem("hasSeenTour", "true");
    setShowTour(false);
  };

  const handleConnectDevice = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsDeviceConnected(true);
    }, 1500);
  };

  useEffect(() => {
    if (timeScale === "Today") {
      setDynamicData(prev => {
        const newData = [...prev];
        const lastIdx = newData.length - 1;
        newData[lastIdx] = {
          ...newData[lastIdx],
          actual: heartRate,
          time: "Now"
        };
        return newData;
      });
    } else {
      setDynamicData(mockData[timeScale]);
    }
  }, [heartRate, timeScale]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setTouchDistance(getTouchDistance(e.touches));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      if (currentDistance !== null) {
        const scale = currentDistance / touchDistance;
        const zoomChange = (scale - 1) * 0.5;
        setZoomLevel(prev => Math.max(0.5, Math.min(2, prev + zoomChange)));
        setTouchDistance(currentDistance);
      }
    }
  };

  const handleTouchEnd = () => setTouchDistance(null);

  const getYAxisDomain = () => {
    const baseMin = 40;
    const baseMax = 150;
    const center = 85;
    const range = (baseMax - baseMin) / zoomLevel;
    return [Math.round(center - range / 2), Math.round(center + range / 2)];
  };

  const [yMin, yMax] = getYAxisDomain();

  const getVideosForMood = () => {
    switch (mood) {
      case 'calm':
        return [
          {
            title: "Morning Meditation for Positivity",
            thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "10:00",
            category: "Meditation",
            url: "https://www.youtube.com/watch?v=inpok4MKVLM"
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
      case 'slightly-anxious':
        return [
          {
            title: "5-Minute Breathing Exercise",
            thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "5:23",
            category: "Breathing",
            url: "https://www.youtube.com/watch?v=tybOi4hjZFQ"
          },
          {
            title: "Calming Yoga Flow",
            thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "20:15",
            category: "Yoga",
            url: "https://www.youtube.com/watch?v=v7AYKMP6rOE"
          },
          {
            title: "Progressive Muscle Relaxation",
            thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "15:40",
            category: "Relaxation",
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
      case 'anxious':
        return [
          {
            title: "Emergency Calm Down Technique",
            thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "3:45",
            category: "Emergency",
            url: "https://www.youtube.com/watch?v=cEqZthCaMpo"
          },
          {
            title: "4-7-8 Breathing for Panic Relief",
            thumbnail: "https://images.unsplash.com/photo-1447968954315-3f0c44f42f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "5:00",
            category: "Breathing",
            url: "https://www.youtube.com/watch?v=gz4G31LGyog"
          },
          {
            title: "Grounding Technique for Anxiety",
            thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "8:30",
            category: "Grounding",
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
      case 'recovering':
        return [
          {
            title: "Recovery and Restoration Meditation",
            thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "12:00",
            category: "Recovery",
            url: "https://www.youtube.com/watch?v=ZToicYcHIOU"
          },
          {
            title: "Gentle Self-Care Yoga",
            thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "25:00",
            category: "Yoga",
            url: "https://www.youtube.com/watch?v=Eml2xnoLpYE"
          },
          {
            title: "Healing Visualization Practice",
            thumbnail: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
            duration: "15:00",
            category: "Visualization",
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
      default:
        return [];
    }
  };

  const getMoodMessage = () => {
    switch (mood) {
      case 'calm':
        return "You're feeling great! Here are some videos to maintain your wellness";
      case 'slightly-anxious':
        return "Feeling a bit tense? These videos can help you relax";
      case 'anxious':
        return "We noticed elevated stress. Try these immediate relief techniques";
      case 'recovering':
        return "Great progress! Here are recovery-focused videos for you";
      default:
        return "Curated content to help you relax and stay healthy";
    }
  };

  const tourStepsData = [
    {
      title: "Welcome to ANXIOCHECK",
      description: "Your personalized platform for health monitoring and wellness tracking. Let's take a quick tour.",
      visual: (
        <div className="w-full h-32 bg-sky-50 dark:bg-[#121212] rounded-xl border border-black/10 dark:border-white/10 p-3 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="w-6 h-6 rounded-md bg-black/10 dark:bg-white/10 flex items-center justify-center"><Menu className="w-3 h-3 text-slate-500" /></div>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Heart className="w-4 h-4 text-blue-500" /></div>
          </div>
          <div className="flex-1 rounded-lg bg-white dark:bg-[#1a1a1a] p-2 shadow-sm flex flex-col justify-end relative">
            <div className="text-[10px] font-bold text-slate-400 absolute top-2 left-2">DASHBOARD OVERVIEW</div>
            <div className="w-full h-1/2 bg-gradient-to-t from-blue-500/20 to-transparent rounded-b-md border-b-2 border-blue-500"></div>
          </div>
        </div>
      )
    },
    {
      title: "Real-time Monitoring",
      description: "When your heart rate spikes above 100 BPM, an urgent 'Danger Check' alert will appear instantly on your screen.",
      visual: (
        <div className="w-full h-32 bg-white dark:bg-[#1a1a1a] rounded-xl border border-red-200 dark:border-red-900/30 p-3 flex flex-col gap-2 relative shadow-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-600 dark:text-red-400">HIGH HEART RATE DETECTED</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-2xl font-black text-red-600 dark:text-red-400">115 <span className="text-[10px] font-normal">BPM</span></div>
            <div className="mt-2 text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-center w-full shadow-sm border border-red-200 dark:border-red-800">
              Click here to assess danger
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Smart Suggestions",
      description: "Below your charts, we suggest curated activities and videos based on your current mood state.",
      visual: (
        <div className="w-full h-32 bg-sky-50 dark:bg-[#121212] rounded-xl border border-black/10 dark:border-white/10 p-3 flex flex-col gap-2 overflow-hidden relative">
          <div className="flex items-center gap-2 mb-1">
            <Smile className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">You're feeling tense</span>
          </div>
          <div className="flex gap-2 w-full h-full overflow-hidden">
            <div className="w-20 h-full rounded-lg bg-slate-200 dark:bg-white/5 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-black border-b-[3px] border-b-transparent ml-0.5"></div></div>
              </div>
            </div>
            <div className="w-20 h-full rounded-lg bg-slate-200 dark:bg-white/5 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-black border-b-[3px] border-b-transparent ml-0.5"></div></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Emergency Protocol",
      description: "In danger? Click 'Activate Emergency Protocol' from the Danger check. On the dark emergency screen, click the Calculator icon (top right) to enter a silent, disguised deception mode.",
      visual: (
        <div className="w-full h-32 flex gap-2">
          {/* Left: Danger Check Button */}
          <div className="w-1/2 h-full bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30 p-2 flex flex-col items-center justify-center gap-2">
            <div className="text-[8px] font-bold text-red-800 text-center uppercase">1. Danger Check</div>
            <div className="w-full bg-red-600 text-white text-[8px] py-2 px-1 rounded shadow-sm text-center font-bold flex items-center justify-center gap-1">
              <AlertTriangle className="w-2 h-2" />
              ACTIVATE EMERGENCY
            </div>
          </div>
          {/* Right: Deception Mode */}
          <div className="w-1/2 h-full bg-black rounded-xl border border-neutral-800 p-2 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="text-[8px] font-bold text-red-500 uppercase flex items-center gap-1"><AlertTriangle className="w-2 h-2" /> 2. Emergency</div>
              <div className="p-1 bg-red-900/30 rounded text-red-400 relative">
                <div className="absolute -inset-1 border border-yellow-400 rounded-md animate-ping"></div>
                <Calculator className="w-3 h-3 relative z-10" />
              </div>
            </div>
            <div className="text-[8px] text-neutral-500 text-right uppercase">Click to disguise</div>
          </div>
        </div>
      )
    },
    {
      title: "Navigation & Reports",
      description: "Use the bottom tab bar to effortlessly switch between Home, your daily surveys (Reports), tracked history, and data management.",
      visual: (
        <div className="w-full h-32 bg-sky-50 dark:bg-[#121212] rounded-xl border border-black/10 dark:border-white/10 p-3 flex flex-col justify-end overflow-hidden relative">
          <div className="flex-1 opacity-20 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 rounded-t-lg mb-2"></div>
          <div className="w-full h-12 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-between px-4 relative">
            <div className="absolute -top-1 left-[15%] w-10 h-10 border-2 border-blue-400/50 rounded-full animate-ping"></div>
            <div className="flex flex-col items-center gap-0.5 relative z-10 text-blue-600 dark:text-blue-400">
              <Home className="w-4 h-4" />
              <div className="text-[6px] font-bold">HOME</div>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-slate-400">
              <FileText className="w-4 h-4" />
              <div className="text-[6px] font-bold">REPORT</div>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-slate-400">
              <Activity className="w-4 h-4" />
              <div className="text-[6px] font-bold">TRACKED</div>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-slate-400">
              <Database className="w-4 h-4" />
              <div className="text-[6px] font-bold">DATA</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const videos = getVideosForMood();

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-[#121212] text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <header className="border-b border-black/10 dark:border-white/10 sticky top-0 z-20 bg-sky-50/80 dark:bg-[#121212]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white dark:bg-[#1a1a1a] border-r-black/10 dark:border-r-white/10 text-slate-900 dark:text-white transition-colors duration-300">
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
                    className="w-full justify-start text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    SIGN OUT
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
               <Activity className="w-5 h-5 text-white" />
             </div>
             <h1 className="font-bold text-lg hidden sm:block">ANXIOCHECK</h1>
          </div>

          <button
            onClick={() => navigate("/calm")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 backdrop-blur-md ${
              mood === 'calm' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30' :
              mood === 'slightly-anxious' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30' :
              mood === 'anxious' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30' :
              'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
            }`}
          >
            {mood === 'calm' && <Smile className="w-4 h-4" />}
            {mood === 'slightly-anxious' && <Baby className="w-4 h-4" />}
            {mood === 'anxious' && <Activity className="w-4 h-4" />}
            {mood === 'recovering' && <Sparkles className="w-4 h-4" />}
            <span className="capitalize hidden sm:inline">
              {mood === 'calm' ? 'Calm' :
               mood === 'slightly-anxious' ? 'Tense' :
               mood === 'anxious' ? 'Anxious' :
               'Recovering'}
            </span>
          </button>
        </div>
      </header>

      <div className="px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="relative pt-10 pb-8 text-center">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-16 bg-white/60 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10 backdrop-blur-xl"></div>
          <h1 className="relative text-4xl sm:text-5xl tracking-tight font-bold text-slate-900 dark:text-white z-10 drop-shadow-sm dark:drop-shadow-md">Levels</h1>
        </div>

        {!isDeviceConnected && (
          <div className="mb-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
            <div className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Welcome to your Health Dashboard</h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                This is your central hub for monitoring your well-being. Once connected, your device will automatically sync your vitals here. We'll use this data to provide personalized wellness exercises, detect elevated stress, and offer immediate relief protocols.
              </p>
              <div className="flex gap-2 text-xs font-medium text-slate-500 dark:text-gray-500">
                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Auto-sync vitals</span>
                <span className="flex items-center gap-1 ml-3"><Smile className="w-3 h-3" /> Track mood</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-200 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-300 dark:border-indigo-500/30">
                  <Watch className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold text-lg">Connect your Device</h3>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm">Link your Fitbit, Apple Watch, or Garmin to sync vitals automatically.</p>
                </div>
              </div>
              <button 
                onClick={handleConnectDevice}
                disabled={isConnecting}
                className="whitespace-nowrap px-6 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 w-full sm:w-auto disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Watch"
                )}
              </button>
            </div>
          </div>
        )}

        {showHighBPAlert && (
          <div className="mb-8 z-10 relative animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => navigate("/danger-check")}>
            <div className="cursor-pointer hover:opacity-90 transition-opacity">
              <AlertCard
                title="Elevated Vitals Detected"
                description="Tap to assess your condition and begin the wellbeing protocol"
                severity="warning"
                expandable={false}
              />
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-center z-10 relative">
          <div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 rounded-full p-1.5 inline-flex border border-black/5 dark:border-white/10 shadow-xl overflow-x-auto max-w-full">
            {(["Today", "Week", "Month", "Year"] as TimeScale[]).map((scale) => (
              <button
                key={scale}
                onClick={() => setTimeScale(scale)}
                className={`px-4 sm:px-6 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium ${
                  timeScale === scale
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-2xl bg-white/60 dark:bg-white/5 rounded-[2rem] p-4 sm:p-8 border border-black/5 dark:border-white/10 mb-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="mb-8 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-medium">
                {timeScale === "Today" ? "Current Heart Rate" : "Average"}
              </div>
              <div className="text-5xl sm:text-6xl font-bold flex items-baseline gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 dark:from-blue-400 dark:to-pink-500 drop-shadow-sm">
                  {timeScale === "Today" ? heartRate : timeScale === "Week" ? "77" : timeScale === "Month" ? "80" : "77"}
                </span>
                <span className="text-slate-500 dark:text-gray-500 text-2xl sm:text-3xl font-medium">bpm</span>
              </div>
            </div>
            
            <div className="flex gap-2 self-end">
              <button onClick={handleZoomOut} className="p-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors">
                <ZoomOut className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              </button>
              <button onClick={handleResetZoom} className="p-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors">
                <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </button>
              <button onClick={handleZoomIn} className="p-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors">
                <ZoomIn className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="relative z-10 w-full bg-white/40 dark:bg-black/20 rounded-2xl p-4 border border-black/5 dark:border-white/5">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart 
                data={dynamicData} 
                onTouchStart={handleTouchStart} 
                onTouchMove={handleTouchMove} 
                onTouchEnd={handleTouchEnd}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <ReferenceArea key="ref-area-1" y1={40} y2={70} fill="#22c55e" fillOpacity={0.05} />
                <ReferenceArea key="ref-area-2" y1={70} y2={90} fill="#f59e0b" fillOpacity={0.05} />
                <ReferenceArea key="ref-area-3" y1={90} y2={150} fill="#ef4444" fillOpacity={0.05} />
                
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" vertical={false} />
                
                <XAxis 
                  key="x-axis"
                  dataKey="time" 
                  stroke="currentColor" 
                  className="text-slate-500 dark:text-gray-400 opacity-60"
                  style={{ fontSize: '12px' }} 
                  tickMargin={10}
                  axisLine={false}
                  tickLine={false}
                />
                
                <YAxis 
                  key="y-axis"
                  stroke="currentColor"
                  className="text-slate-500 dark:text-gray-400 opacity-60"
                  style={{ fontSize: '12px' }} 
                  domain={[yMin, yMax]} 
                  axisLine={false}
                  tickLine={false}
                />
                
                <ReferenceLine key="ref-line-1" y={70} stroke="rgba(34, 197, 94, 0.3)" strokeDasharray="3 3" />
                <ReferenceLine key="ref-line-2" y={90} stroke="rgba(245, 158, 11, 0.3)" strokeDasharray="3 3" />
                <ReferenceLine key="ref-line-3" y={100} stroke="rgba(239, 68, 68, 0.3)" strokeDasharray="3 3" />
                
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid rgba(0, 0, 0, 0.1)', 
                    borderRadius: '12px', 
                    color: '#000',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                
                <Line 
                  key="line-baseline"
                  type="monotone" 
                  dataKey="baseline" 
                  stroke="rgba(156,163,175,0.5)" 
                  strokeDasharray="5 5" 
                  dot={false} 
                  name="Baseline" 
                  strokeWidth={2}
                />
                
                <Line 
                  key="line-actual"
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ fill: '#2563eb', stroke: '#bfdbfe', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#fff' }}
                  name="Heart Rate" 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm relative z-10">
            <div className="flex items-center gap-2 bg-white/60 dark:bg-black/20 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
              <span className="text-slate-700 dark:text-gray-300 font-medium">Resting (&lt;70)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-black/20 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
              <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></div>
              <span className="text-slate-700 dark:text-gray-300 font-medium">Normal (70-90)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-black/20 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400"></div>
              <span className="text-slate-700 dark:text-gray-300 font-medium">Elevated (&gt;90)</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 dark:border-white/10 mb-8 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Suggestions & Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-1">Stay Active</h4>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">Consider a light 15-minute walk to stabilize your readings. Your recent trend shows good responsiveness to moderate activity.</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-purple-800 dark:text-purple-300 font-medium mb-1">Pacing</h4>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">Your baseline is steady. Try incorporating short breathing exercises if you notice a sudden spike during work hours.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 dark:border-white/10 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recommended for You</h3>
            <span className="text-xs font-medium px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full capitalize">
              {mood === 'slightly-anxious' ? 'tense' : mood}
            </span>
          </div>
          <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">{getMoodMessage()}</p>
          
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex w-max gap-4 px-1">
              {videos.map((video, index) => (
                <div key={index} className="w-[280px] flex-shrink-0">
                  <VideoCard {...video} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="opacity-50 hover:opacity-100 transition-opacity" />
          </ScrollArea>
        </div>

        <div className="text-center mt-12 pb-24 md:pb-12 space-y-1.5 opacity-80">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Product by Invero, Inc.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built by Tshepo Nchabeleng, Sbusiso Ndhlovu, & Ndabezihle Zwane
          </p>
        </div>
      </div>
      
      {showTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sky-900/80 dark:bg-black/90 backdrop-blur-sm transition-all duration-500">
          <div className="bg-white dark:bg-[#1a1a1a] max-w-md w-full rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-sky-100 dark:border-white/10">
            <div className="absolute top-0 left-0 w-full h-1 flex">
              {tourStepsData.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-full flex-1 transition-all duration-300 ${
                    idx <= tourStep ? 'bg-blue-500' : 'bg-slate-100 dark:bg-white/5'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-full mb-6 relative">
                {tourStepsData[tourStep].visual}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {tourStepsData[tourStep].title}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8">
                {tourStepsData[tourStep].description}
              </p>
              
              <div className="flex items-center justify-between w-full mt-4">
                <button
                  onClick={() => handleCompleteTour()}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors px-4 py-2"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    if (tourStep < tourStepsData.length - 1) {
                      setTourStep(prev => prev + 1);
                    } else {
                      handleCompleteTour();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30"
                >
                  {tourStep < tourStepsData.length - 1 ? (
                    <>Next <ChevronRight className="w-4 h-4" /></>
                  ) : (
                    <>Get Started <Check className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sky-50/90 dark:bg-[#121212]/90 backdrop-blur-lg border-t border-black/10 dark:border-white/10 z-50 pb-safe">
        <div className="grid grid-cols-4">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 text-xs ${item.path === '/dashboard' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'text-slate-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-gray-200'}`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
