// Import RouterProvider component from react-router for rendering routes
import { RouterProvider } from 'react-router';
// Import router configuration containing all application routes
import { router } from './routes';

/**
 * App Component - Main application entry point
 * 
 * This is the root component that sets up React Router for the entire application.
 * It uses RouterProvider to enable client-side routing between pages without full page reloads.
 * 
 * The router configuration (imported from './routes') defines:
 * - "/" route: LevelsPage (heart rate tracking dashboard)
 * - "/calm-state" route: CalmStatePage (breathing exercises and BP monitoring)
 * 
 * @returns React Router provider wrapping the entire application
 */
export default function App() {
  // Render RouterProvider with our configured router
  // This enables navigation between LevelsPage and CalmStatePage
  return <RouterProvider router={router} />;
}
