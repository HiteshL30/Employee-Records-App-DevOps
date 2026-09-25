import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <Outlet />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
          EmployeeHub · Employee Records Management
        </div>
      </footer>
    </div>
  );
};

export default App;