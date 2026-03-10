# ANXIOCHECK Code Documentation
## Comprehensive Guide to Understanding and Editing the Codebase

---

## 📁 File Structure Overview

### Core Files Created/Modified:
1. `/src/app/context/health-context.tsx` - Global health simulation system
2. `/src/app/App.tsx` - Root application wrapper
3. `/src/app/pages/dashboard.tsx` - Main dashboard with vitals and videos
4. `/src/app/pages/danger-check.tsx` - Emergency assessment page
5. `/src/app/pages/report.tsx` - Health reports with download functionality
6. `/src/app/pages/tracked.tsx` - Visual charts and statistics
7. `/src/app/pages/data.tsx` - Searchable data table
8. `/src/app/components/video-card.tsx` - Clickable video cards

---

## 🏥 1. HEALTH CONTEXT (`/src/app/context/health-context.tsx`)

### Purpose:
This file creates a **global health simulation** that runs continuously across all pages. Think of it as the "heart" of the application that keeps beating no matter where the user navigates.

### Key Concepts:

#### **React Context Pattern**
```typescript
const HealthContext = createContext<HealthContextType | undefined>(undefined);
```
- **Why**: Allows ANY component in the app to access health data without passing props through every level
- **How to use**: Import `useHealth()` hook in any component to get current vitals

#### **State Management**
```typescript
const [heartRate, setHeartRate] = useState(72);
```
- **Why 72**: Normal resting heart rate for adults
- **State updates**: Happens every 2 seconds via `setInterval` in useEffect
- **Editing**: To change initial values, modify the `useState(72)` number

#### **Simulation Phases**
The simulation goes through 5 distinct phases:

1. **NORMAL** (10 seconds): HR 70-75, BP 115-122/75-82, SpO2 97-98%
   - Small random fluctuations simulate natural variability
   - After 10 seconds, automatically transitions to BUILDING

2. **BUILDING** (~20 seconds): HR increases to 105, BP rises to 145/95
   - Consistent upward trend with slight randomness
   - Alert triggers when HR > 100 (abnormal threshold)
   - Simulates anxiety attack onset

3. **PEAK** (15 seconds): HR 105-112, BP 142-148/93-98, SpO2 92-94%
   - Larger random fluctuations simulate panic state
   - Highest stress level in simulation

4. **PLATEAU** (20 seconds): HR stabilizes 95-100, BP 130-138/85-90
   - Metrics begin to decrease
   - Alert dismisses when HR ≤ 100

5. **RECOVERY** (indefinite): Returns to normal resting values
   - Gradual decrease back to baseline
   - Alert stays dismissed

#### **Critical Code Sections**

**Alert Triggering** (Line ~119):
```typescript
if (newRate > 100) {
  setShowHighBPAlert(true);
}
```
- **Why 100**: Clinical threshold for elevated heart rate
- **To modify**: Change number to adjust sensitivity
- **Impact**: Affects when danger assessment page is suggested

**Alert Dismissal** (Line ~163):
```typescript
if (newRate <= 100) {
  setShowHighBPAlert(false);
}
```
- **Why**: Clears warning when user returns to normal
- **Timing**: Happens during PLATEAU and RECOVERY phases

**History Recording** (Line ~324):
```typescript
setInterval(() => {
  setHistory((prev) => [...prev, newEntry].slice(-50));
}, 10000);
```
- **Why 10 seconds**: Balances data granularity with storage
- **Why 50 entries**: Keeps ~8 minutes of history (50 × 10 seconds)
- **To modify**: Change `10000` for frequency, `-50` for history length

**Reset Function** (Line ~84):
```typescript
const resetToCalm = () => {
  setSimulationPhase('recovery');
  setElapsedTime(65);
};
```
- **Why 65**: Skips directly to recovery phase start time
- **When called**: User clicks "NO - I'm feeling okay" in danger assessment
- **Effect**: Immediately begins calming simulation

---

## 🎯 2. APP COMPONENT (`/src/app/App.tsx`)

### Purpose:
Root component that wraps the entire application with necessary providers.

### Structure:
```typescript
<HealthProvider>           // Makes health data available everywhere
  <RouterProvider />       // Handles page navigation
</HealthProvider>
```

### Why This Order:
1. **HealthProvider outermost**: All pages need access to health data
2. **RouterProvider inside**: Different pages can use `useHealth()` hook

### To Add New Global Providers:
```typescript
<NewProvider>
  <HealthProvider>
    <RouterProvider />
  </HealthProvider>
</NewProvider>
```

---

## 🏠 3. DASHBOARD PAGE (`/src/app/pages/dashboard.tsx`)

### Purpose:
Main landing page after login showing real-time vitals and mood-based videos.

### Key Features:

#### **Health Data Access** (Line 19):
```typescript
const { heartRate, spo2, bloodPressure, showHighBPAlert, mood } = useHealth();
```
- **Destructuring**: Extracts specific values from context
- **Real-time**: Values update every 2 seconds automatically
- **No props needed**: Context eliminates prop drilling

#### **Mood Detection** (Line 22):
```typescript
const isNormal = heartRate <= 80 && spo2 >= 95 && bloodPressure.systolic <= 130;
```
- **Why these thresholds**:
  - HR ≤ 80: Normal resting heart rate
  - SpO2 ≥ 95: Healthy oxygen saturation
  - Systolic ≤ 130: Normal blood pressure
- **To modify**: Adjust numbers to change normal range definition

#### **Video Recommendations** (Line 38):
```typescript
const getVideosForMood = () => {
  switch (mood) {
    case 'calm': return calmVideos;
    case 'slightly-anxious': return breathingVideos;
    case 'anxious': return emergencyVideos;
    case 'recovering': return recoveryVideos;
  }
};
```
- **Dynamic content**: Videos change based on current mood
- **Mood calculation**: Determined in health-context.tsx based on HR
- **To add videos**: Add objects to respective arrays with title, thumbnail, duration, category, url

#### **Navigation Structure**:
```typescript
const navigationItems = [
  { icon: Home, label: "HOME", path: "/dashboard" },
  { icon: FileText, label: "REPORT", path: "/report" },
  // ... etc
];
```
- **Centralized**: Define once, used in hamburger menu and mobile nav
- **To add page**: Add object with icon, label, and path

#### **Alert Click Handler** (Line 339):
```typescript
<div onClick={() => navigate("/danger-check")}>
  <AlertCard ... />
</div>
```
- **Why wrapper div**: Makes entire alert card clickable
- **Navigate**: React Router function to change pages
- **Path**: Must match route in routes.tsx

---

## ⚠️ 4. DANGER CHECK PAGE (`/src/app/pages/danger-check.tsx`)

### Purpose:
Emergency assessment when high blood pressure detected. Guides user through safety check.

### Key Features:

#### **State Management** (Line 9):
```typescript
const [response, setResponse] = useState<"danger" | "safe" | null>(null);
```
- **null**: Initial state, shows question
- **"danger"**: Shows emergency contact options
- **"safe"**: Shows self-care recommendations

#### **Recovery Trigger** (Line 16):
```typescript
const handleSafe = () => {
  setResponse("safe");
  setTimeout(() => {
    resetToCalm();  // Starts recovery simulation
  }, 2000);
};
```
- **Why setTimeout**: 2-second delay for user to read response
- **resetToCalm()**: From useHealth() context, initiates recovery phase
- **Effect**: Heart rate begins decreasing back to normal

#### **Real-time BP Display** (Line 49):
```typescript
Your current reading: {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)} mmHg
```
- **Math.round()**: Converts decimal to whole number (145.7 → 146)
- **Live updating**: Values continue updating from context
- **Template literal**: JavaScript expression inside JSX

#### **Conditional Rendering**:
```typescript
{!response ? (
  // Show question
) : response === "danger" ? (
  // Show emergency options
) : (
  // Show safe recommendations
)}
```
- **Ternary operator**: Three-way conditional rendering
- **Sequence**: null → question, "danger" → emergency, "safe" → tips

---

## 📊 5. REPORT PAGE (`/src/app/pages/report.tsx`)

### Purpose:
Generate and download health reports with current status summary.

### Key Features:

#### **Download Functionality** (Line 37):
```typescript
const downloadReport = (format: 'pdf' | 'csv') => {
  const blob = new Blob([reportData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ANXIOCHECK_Report_${date}.txt`;
  a.click();
};
```
- **Blob**: Creates file in browser memory
- **createObjectURL**: Generates temporary download link
- **createElement('a')**: Creates invisible link element
- **click()**: Programmatically triggers download
- **Cleanup**: Important to revoke URL after use

#### **Report Content** (Line 28):
```typescript
const reportData = `
ANXIOCHECK Health Report
Generated: ${new Date().toLocaleString()}
...
=== CURRENT VITALS ===
Heart Rate: ${Math.round(heartRate)} BPM
...
`;
```
- **Template literal**: Multi-line string with embedded variables
- **toLocaleString()**: Formats date/time for user's locale
- **Structure**: Plain text format readable in any text editor

#### **Trend Calculation** (Line 75):
```typescript
const getHeartRateTrend = () => {
  const recent = history.slice(-5).average();
  const earlier = history.slice(0, 5).average();
  return recent > earlier ? 'up' : 'down';
};
```
- **slice(-5)**: Gets last 5 entries
- **slice(0, 5)**: Gets first 5 entries
- **Comparison**: Determines if HR is increasing or decreasing
- **Visual**: Shows trending up/down arrow icon

---

## 📈 6. TRACKED PAGE (`/src/app/pages/tracked.tsx`)

### Purpose:
Visualize health data trends with interactive charts using Recharts library.

### Key Features:

#### **Chart Data Preparation** (Line 38):
```typescript
const chartData = history.map((entry, index) => ({
  time: entry.timestamp.toLocaleTimeString(),
  heartRate: entry.heartRate,
  spo2: entry.spo2,
  systolic: entry.bloodPressure.systolic,
}));
```
- **map()**: Transforms history array into chart-friendly format
- **toLocaleTimeString()**: Formats timestamp for X-axis
- **Why separate properties**: Recharts needs flat object structure

#### **Statistics Calculation** (Line 47):
```typescript
const stats = {
  avgHeartRate: Math.round(history.reduce((sum, e) => sum + e.heartRate, 0) / history.length),
  maxHeartRate: Math.max(...history.map(e => e.heartRate)),
  minHeartRate: Math.min(...history.map(e => e.heartRate)),
};
```
- **reduce()**: Sums all heart rates then divides by count
- **Math.max()**: Finds highest value in array
- **Spread operator (...)**: Converts array to individual arguments

#### **Recharts Configuration** (Line 120):
```typescript
<LineChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />  {/* Grid lines */}
  <XAxis dataKey="time" />                  {/* Time labels */}
  <YAxis domain={[60, 120]} />              {/* Y-axis range */}
  <Tooltip />                               {/* Hover info */}
  <Legend />                                {/* Chart key */}
  <Line dataKey="heartRate" stroke="#3b82f6" strokeWidth={2} />
</LineChart>
```
- **domain**: Sets Y-axis min/max for better visualization
- **dataKey**: Links to property in chartData objects
- **stroke**: Line color (hex code for blue)
- **To modify**: Change domain, colors, or strokeWidth

---

## 🗄️ 7. DATA PAGE (`/src/app/pages/data.tsx`)

### Purpose:
Searchable table view of all recorded health data.

### Key Features:

#### **Search Functionality** (Line 49):
```typescript
const filteredHistory = history.filter((entry) => {
  const searchLower = searchTerm.toLowerCase();
  return (
    entry.heartRate.toString().includes(searchLower) ||
    entry.spo2.toString().includes(searchLower) ||
    entry.timestamp.toLocaleString().toLowerCase().includes(searchLower)
  );
});
```
- **filter()**: Creates new array with matching entries
- **toLowerCase()**: Case-insensitive search
- **toString()**: Converts numbers to searchable strings
- **includes()**: Checks if search term is anywhere in text

#### **Table Rendering** (Line 159):
```typescript
{filteredHistory.map((entry, index) => {
  const isNormal = entry.heartRate <= 100 && entry.spo2 >= 95;
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{entry.timestamp.toLocaleDateString()}</td>
      {/* ... */}
    </tr>
  );
})}
```
- **map()**: Creates table row for each entry
- **key={index}**: Required by React for list items
- **isNormal**: Calculated per row for status badge
- **Color coding**: Conditional classes based on values

---

## 🎬 8. VIDEO CARD COMPONENT (`/src/app/components/video-card.tsx`)

### Purpose:
Reusable card component for displaying clickable video recommendations.

### Key Features:

#### **Props Interface** (Line 7):
```typescript
interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  url?: string;  // Optional
}
```
- **Interface**: TypeScript type definition
- **Optional (?)**: url may or may not be provided
- **Purpose**: Ensures correct props are passed

#### **Click Handler** (Line 20):
```typescript
const handleClick = () => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
```
- **window.open()**: Opens new browser tab
- **'_blank'**: Target parameter for new tab
- **'noopener,noreferrer'**: Security flags to prevent access to opener window

#### **Hover Effect** (Line 37):
```typescript
<div className="opacity-0 group-hover:opacity-100 transition-opacity">
  <Play />
</div>
```
- **opacity-0**: Hidden by default
- **group-hover**: Shows when parent (.group) is hovered
- **transition-opacity**: Smooth fade in/out
- **Tailwind CSS**: Utility classes for styling

---

## 🔄 Data Flow Summary

```
1. HealthProvider (context)
   └─> Updates health metrics every 2 seconds
   └─> Records history every 10 seconds
   └─> Provides data via useHealth() hook

2. Any Page Component
   └─> Calls useHealth() to get current data
   └─> Receives real-time updates automatically
   └─> No props, no state duplication

3. User Navigation
   └─> Changes route/page
   └─> Health simulation CONTINUES in background
   └─> Returns to dashboard = same ongoing simulation

4. User Interaction (Danger Check)
   └─> Clicks "I'm feeling okay"
   └─> Calls resetToCalm()
   └─> Simulation jumps to recovery phase
   └─> All pages see the change immediately
```

---

## 🛠️ Common Editing Tasks

### Change Heart Rate Thresholds:
```typescript
// In health-context.tsx, line 119
if (newRate > 100) {  // Change this number
  setShowHighBPAlert(true);
}
```

### Modify Simulation Timing:
```typescript
// In health-context.tsx, line 99
}, 2000);  // Change milliseconds (1000 = 1 second)
```

### Add New Navigation Link:
```typescript
// In any page component
const navigationItems = [
  // ... existing items
  { icon: NewIcon, label: "NEW PAGE", path: "/newpage" },
];
```

### Change Video Recommendations:
```typescript
// In dashboard.tsx, getVideosForMood()
case 'calm':
  return [
    {
      title: "New Video Title",
      thumbnail: "https://...",
      duration: "15:00",
      category: "Category Name",
      url: "https://youtube.com/watch?v=..."
    },
    // ... more videos
  ];
```

### Adjust History Storage:
```typescript
// In health-context.tsx, line 336
return [...prev, newEntry].slice(-50);  // Change -50 to keep more/less history
```

### Modify Blood Pressure Ranges:
```typescript
// In health-context.tsx, normal phase (line 267)
systolic: Math.max(115, Math.min(122, ...))  // Change min/max values
```

---

## ⚙️ Technical Notes

### Why useEffect with Dependencies:
```typescript
useEffect(() => {
  // Code runs when dependencies change
}, [dependency1, dependency2]);
```
- **Empty []**: Runs once on mount
- **[state]**: Runs when state changes
- **No array**: Runs on every render (avoid!)

### Why setInterval Cleanup:
```typescript
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);  // IMPORTANT
}, []);
```
- **Without cleanup**: Multiple intervals stack up
- **Result**: Memory leaks, performance issues
- **Always**: Return cleanup function

### Why Context vs Props:
- **Props**: Parent → Child (one direction, one level)
- **Context**: Provider → Any descendant (many levels)
- **Use Context when**: Data needed by many components at different nesting levels

### Why Math.round():
```typescript
{Math.round(heartRate)}  // 72.4567 → 72
```
- **Cleaner display**: Whole numbers easier to read
- **Medical convention**: Vitals typically shown as integers
- **Consistency**: All values displayed uniformly

---

## 🐛 Debugging Tips

### Health Data Not Updating:
1. Check if component is wrapped in `<HealthProvider>`
2. Verify `useHealth()` is called inside functional component
3. Check browser console for "must be used within a HealthProvider" error

### Alert Not Appearing:
1. Verify heart rate exceeds threshold (100 BPM)
2. Check `showHighBPAlert` value in React DevTools
3. Ensure alert component is conditionally rendered

### Videos Not Clickable:
1. Check if `url` prop is provided to VideoCard
2. Verify URL format (https://youtube.com/watch?v=...)
3. Check browser console for blocked popups

### Charts Not Displaying:
1. Ensure `history` array has data (wait 10+ seconds)
2. Check if Recharts is installed (`package.json`)
3. Verify `chartData` format matches Recharts expectations

---

## 📝 Code Style Guide

### Naming Conventions:
- **Components**: PascalCase (Dashboard, VideoCard)
- **Functions**: camelCase (handleClick, resetToCalm)
- **Constants**: UPPER_SNAKE_CASE or camelCase
- **Files**: kebab-case (health-context.tsx)

### Component Structure:
```typescript
// 1. Imports
import { useState } from 'react';

// 2. Interfaces/Types
interface Props { ... }

// 3. Component
export default function Component() {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Functions
  const handleClick = () => {};
  
  // 6. Effects
  useEffect(() => {}, []);
  
  // 7. Render
  return ( ... );
}
```

### Comments:
```typescript
// Single line for brief explanation

/**
 * Multi-line for complex logic
 * Explain WHY, not WHAT
 * Include edge cases
 */

// TODO: Future enhancement
// FIXME: Known issue
// NOTE: Important context
```

---

## 🚀 Performance Considerations

### Why 2-Second Updates:
- **Balance**: Smooth vs performance
- **Too fast (<1s)**: Excessive re-renders
- **Too slow (>5s)**: Choppy animation
- **2 seconds**: Sweet spot for health simulation

### Why 50 History Entries:
- **Storage**: Prevents infinite growth
- **Relevance**: ~8 minutes is medically relevant
- **Performance**: Small arrays render faster
- **To increase**: Change `.slice(-50)` carefully

### Component Re-renders:
```typescript
const { heartRate } = useHealth();  // Re-renders when heartRate changes
```
- **React optimization**: Only re-renders when used values change
- **Avoid**: Destructuring unused values
- **Best practice**: Only take what you need

---

## 🔐 Security Notes

### LocalStorage Usage:
```typescript
localStorage.setItem("isAuthenticated", "true");
```
- **Not secure**: Client-side storage
- **Okay for**: Demo apps, non-sensitive data
- **Not for**: Production, real medical data, passwords
- **Better alternative**: Backend authentication with tokens

### Window.open() Security:
```typescript
window.open(url, '_blank', 'noopener,noreferrer');
```
- **noopener**: Prevents access to window.opener
- **noreferrer**: Doesn't send referrer header
- **Why**: Protects against malicious sites

---

## 📚 Additional Resources

### React Concepts Used:
- useState: Managing component state
- useEffect: Side effects and lifecycle
- useContext: Global state management
- Custom Hooks: useHealth()

### Libraries Used:
- React Router: Navigation between pages
- Recharts: Data visualization
- Lucide React: Icon library
- Radix UI: Accessible UI components

### Tailwind CSS Classes:
- `flex`: Flexbox layout
- `grid`: CSS Grid layout
- `hover:`: Hover state styling
- `md:`: Medium breakpoint (768px+)
- `rounded-lg`: Border radius
- `bg-blue-600`: Background color

---

## 💡 Extension Ideas

### Add New Vital Sign:
1. Add state in health-context.tsx
2. Create simulation logic in useEffect
3. Add to HealthData interface
4. Display in dashboard component

### Add New Page:
1. Create component in /pages/
2. Add route in routes.tsx
3. Add navigation item to array
4. Test navigation and data access

### Customize Simulation:
1. Modify phase timing (elapsedTime checks)
2. Change value ranges (min/max)
3. Adjust rate of change (increments)
4. Add new phases

### Export as PDF:
1. Install jsPDF library
2. Format report data
3. Generate PDF blob
4. Trigger download

---

This documentation provides comprehensive understanding of the codebase architecture, data flow, and implementation details. Use it as a reference when making modifications or debugging issues.
