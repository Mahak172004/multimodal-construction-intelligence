import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SafetyMonitor from "./components/SafetyMonitor";
import CrackAnalysis from "./components/CrackAnalysis";
import ValuationEngine from "./components/ValuationEngine";
import ProjectPlanner from "./components/ProjectPlanner";
import DailySiteLogs from "./components/DailySiteLogs";
import WeatherAdvisory from "./components/WeatherAdvisory";
import KnowledgeAssistant from "./components/KnowledgeAssistant";
import { checkBackendHealth } from "./services/api";
import { ShieldCheck, Cpu, Database, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("safety");
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    async function verifyHealth() {
      const status = await checkBackendHealth();
      setBackendStatus(status);
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "safety" && <SafetyMonitor />}
        {activeTab === "crack" && <CrackAnalysis />}
        {activeTab === "valuation" && <ValuationEngine />}
        {activeTab === "planner" && <ProjectPlanner />}
        {activeTab === "sitelog" && <DailySiteLogs />}
        {activeTab === "weather" && <WeatherAdvisory />}
        {activeTab === "assistant" && <KnowledgeAssistant />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">
              Multimodal Construction Intelligence Platform
            </span>
            <span className="text-slate-600">|</span>
            <span>Generative AI with Google Cloud</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-amber-400" /> Multimodal LLM & Computer Vision
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Database className="w-3.5 h-3.5 text-blue-400" /> FastAPI High-Performance Backend
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> OSHA & ACI Code Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
