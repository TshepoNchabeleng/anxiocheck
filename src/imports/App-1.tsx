// Import RouterProvider component from react-router for handling navigation
// RouterProvider is the top-level component that enables routing throughout the app
import { RouterProvider } from "react-router";

// Import the router configuration that defines all routes (pages) in the app
// This contains the mapping of URLs to components (e.g., "/" -> Auth, "/dashboard" -> Dashboard)
import { router } from "./routes";

// Import HealthProvider to wrap entire app and provide global health simulation
// This ensures health metrics update continuously across all pages
import { HealthProvider } from "./context/health-context";

// ========================================
// MAIN APP COMPONENT - ROOT OF APPLICATION
// ========================================
// This is the top-level component that renders the entire ANXIOCHECK application
//
// ARCHITECTURE NOTE:
// HealthProvider MUST wrap RouterProvider at this level when using createBrowserRouter
// This ensures the context is available to all routes before React Router initializes
export default function App() {
  return (
    // Wrap entire app in HealthProvider to make health data available everywhere
    // This allows any page/component to access current vitals via useHealth() hook
    // The provider starts the health simulation and manages all health state
    <HealthProvider>
      {/* RouterProvider handles all navigation and renders the appropriate page */}
      {/* based on the current URL path */}
      <RouterProvider router={router} />
    </HealthProvider>
  );
}

/* ========================================
   APP COMPONENT EXPLANATION
   ======================================== 
   
   This component serves as the entry point for the entire application.
   
   CRITICAL ARCHITECTURE:
   When using createBrowserRouter (data router), the HealthProvider MUST
   be at the App level, wrapping the RouterProvider. This is because:
   
   1. createBrowserRouter creates its own component tree
   2. Context providers inside route elements are isolated per route
   3. The router needs access to context before rendering any route
   4. Wrapping at App level ensures consistent context across all navigation
   
   STRUCTURE:
   <HealthProvider>          ← Provides health context to entire app
     <RouterProvider>        ← Handles routing and navigation
       <Auth />              ← Auth page (doesn't use context but it's available)
       <Dashboard />         ← Uses useHealth() successfully
       <Report />            ← Uses useHealth() successfully
       All other pages...
     </RouterProvider>
   </HealthProvider>
   
   BENEFITS:
   - Single health simulation instance for entire session
   - Context persists across all route changes
   - No context re-initialization when navigating
   - Simulation continues running seamlessly between pages
   - Prevents "useHealth must be used within HealthProvider" errors
*/