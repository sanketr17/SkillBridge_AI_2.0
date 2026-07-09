import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-2xl space-y-6">
        <div className="flex flex-col items-center">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg mb-3">
            <GraduationCap className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-sans">404 - Node Offline</h2>
          <p className="text-xs text-slate-400 mt-1">The path you requested could not be resolved inside this academic cluster.</p>
        </div>

        <div className="pt-4 border-t border-slate-800/60 flex flex-col gap-3">
          <Link to="/dashboard">
            <Button variant="primary" fullWidth>
              Return to Console <Home className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium">
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
