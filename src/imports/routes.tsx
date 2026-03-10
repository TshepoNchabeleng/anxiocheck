// Import React for JSX
import React from "react";

// Import React Router components - IMPORTANT: Use 'react-router' not 'react-router-dom'
import { createBrowserRouter, Navigate } from "react-router";

// Import page components
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import DangerCheck from "./pages/danger-check";
import Report from "./pages/report";
import Tracked from "./pages/tracked";
import Data from "./pages/data";
import ForgotPassword from "./pages/forgot-password";
import Calm from "./pages/calm";

// ========================================
// ERROR BOUNDARY COMPONENT
// ========================================
// Simple error fallback component for router errors
function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-4">Something went wrong.</p>
        <button
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

// ========================================
// AUTHENTICATION CHECK FUNCTION
// ========================================
// Checks localStorage for authentication flag set during login/signup
// Returns true if user has successfully authenticated, false otherwise
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// ========================================
// PROTECTED ROUTE WRAPPER COMPONENT
// ========================================
// This component wraps all authenticated pages and:
// 1. Checks if user is logged in
// 2. Redirects to login page if not authenticated
// 3. Renders the protected component if authenticated
//
// NOTE: HealthProvider is NOT included here - it's at the App.tsx level
// This is required for createBrowserRouter to work properly with context
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // If not authenticated, redirect to auth page
  // If authenticated, render the protected page component
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// ========================================
// ROUTER CONFIGURATION
// ========================================
// Defines all routes (URLs) and their corresponding page components
// HealthProvider wrapping happens at App.tsx level, not here
export const router = createBrowserRouter([
  {
    // Public authentication route (login/signup page)
    path: "/",
    element: <Auth />,
    errorElement: <ErrorBoundary />,
  },
  {
    // Forgot password page (public)
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorBoundary />,
  },
  {
    // Main dashboard - home page after login
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // Emergency assessment page - shown when high BP alert is clicked
    path: "/danger-check",
    element: (
      <ProtectedRoute>
        <DangerCheck />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // Health report page - displays summary and download options
    path: "/report",
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // Tracked page - shows charts and graphs of health data
    path: "/tracked",
    element: (
      <ProtectedRoute>
        <Tracked />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // Data page - displays raw data table
    path: "/data",
    element: (
      <ProtectedRoute>
        <Data />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // Calm & relaxation page - interactive stress relief tools
    path: "/calm",
    element: (
      <ProtectedRoute>
        <Calm />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);

/* ========================================
   ROUTING ARCHITECTURE EXPLANATION
   ========================================
   
   This file defines the routing structure for ANXIOCHECK.
   
   IMPORTANT: HEALTHPROVIDER LOCATION
   
   With createBrowserRouter (React Router v6 data API), the HealthProvider
   MUST be placed at the App.tsx level, wrapping the RouterProvider.
   It CANNOT be inside the route configuration here.
   
   WHY?
   - createBrowserRouter creates its own component tree
   - Context providers inside route elements are scoped per-route
   - This would create separate health simulation instances per page
   - The router needs context available before rendering any route
   
   CORRECT STRUCTURE (implemented):
   
   App.tsx:
     <HealthProvider>           ← Single instance for entire app
       <RouterProvider>         ← Router with all route definitions
         Route components...    ← All have access to useHealth()
       </RouterProvider>
     </HealthProvider>
   
   ROUTE PROTECTION:
   
   Each protected route is wrapped with <ProtectedRoute> which:
   1. Checks localStorage for "isAuthenticated" flag
   2. Redirects to "/" if not authenticated
   3. Renders the page component if authenticated
   
   AUTH FLOW:
   
   1. User visits app → Redirected to "/" (Auth page)
   2. User signs up/logs in → Sets "isAuthenticated" = "true"
   3. User navigates to "/dashboard" → ProtectedRoute allows access
   4. User clicks logout → Removes "isAuthenticated" flag
   5. User tries to access protected route → Redirected back to "/"
   
   FORGOT PASSWORD FLOW:
   
   1. User clicks "Forgot Password?" on login page
   2. Navigates to "/forgot-password" (public page)
   3. User enters email or username
   4. System validates and "sends" reset email (mock in demo)
   5. In production, email contains link to reset password page
   
   PAGES:
   
   Public:
   - "/" → Auth (login/signup page)
   - "/forgot-password" → Password reset request page
   
   Protected:
   - "/dashboard" → Main health monitoring dashboard
   - "/danger-check" → Emergency assessment (from high BP alert)
   - "/report" → Health report with download options
   - "/tracked" → Charts and graphs of health history
   - "/data" → Raw data table display
   - "/calm" → Relaxation techniques page
   
   HEALTH SIMULATION:
   
   Since HealthProvider wraps everything at App level:
   - Simulation starts when app loads
   - Simulation continues running across all page navigation
   - All protected pages share the same health state
   - No reset when switching between pages
   - Single source of truth for all health metrics
*/