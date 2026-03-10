import React from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import DangerCheck from "./pages/danger-check";
import Emergency from "./pages/emergency";
import Report from "./pages/report";
import Tracked from "./pages/tracked";
import Data from "./pages/data";
import ForgotPassword from "./pages/forgot-password";
import Calm from "./pages/calm";
import Survey from "./pages/survey";
import Results from "./pages/results";

function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-[#121212] transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Oops!</h1>
        <p className="text-slate-600 dark:text-gray-400 mb-4">Something went wrong.</p>
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

const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/danger-check",
    element: (
      <ProtectedRoute>
        <DangerCheck />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/emergency",
    element: (
      <ProtectedRoute>
        <Emergency />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/report",
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/tracked",
    element: (
      <ProtectedRoute>
        <Tracked />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/data",
    element: (
      <ProtectedRoute>
        <Data />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/calm",
    element: (
      <ProtectedRoute>
        <Calm />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/survey",
    element: (
      <ProtectedRoute>
        <Survey />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/results",
    element: (
      <ProtectedRoute>
        <Results />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);
