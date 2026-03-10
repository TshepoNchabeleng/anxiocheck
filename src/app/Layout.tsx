import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-900 font-sans selection:bg-neutral-200 flex items-center justify-center p-4">
      <main className="w-full max-w-md h-[850px] max-h-[90vh] bg-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
