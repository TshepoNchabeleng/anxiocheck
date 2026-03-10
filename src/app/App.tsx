import { RouterProvider } from "react-router";
import { router } from "./routes";
import { HealthProvider } from "./context/health-context";

export default function App() {
  return (
    <HealthProvider>
      <RouterProvider router={router} />
    </HealthProvider>
  );
}
