import React from "react";
import { 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  CalendarRange, 
  ClipboardList, 
  CloudSun, 
  Bot, 
  HardHat, 
  Activity, 
  Sparkles
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const tabs = [
    { id: "safety", label: "Safety Monitoring", icon: ShieldCheck, badge: "Multimodal" },
    { id: "crack", label: "Crack & Structural Defect", icon: Search, badge: "Vision AI" },
    { id: "valuation", label: "Cost & Valuation", icon: TrendingUp, badge: "Analytics" },
    { id: "planner", label: "Project Planning & WBS", icon: CalendarRange, badge: "Execution" },
    { id: "sitelog", label: "Daily Site Briefing", icon: ClipboardList, badge: "Field Ops" },
    { id: "weather", label: "Weather Advisory", icon: CloudSun, badge: "Safety Risk" },
    { id: "assistant", label: "Engineering Assistant", icon: Bot, badge: "Knowledge" },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <HardHat className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Multimodal Construction Intelligence Platform
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 mr-1" /> GenAI Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Decision-Support System: Multimodal Vision, Real-Time Safety & Cost Engineering
            </p>
          </div>
        </div>

        {/* Backend & Model Status Pill */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                backendStatus?.status === "healthy" ? "bg-emerald-400 animate-ping" : "bg-emerald-500"
              }`}
            />
            <span className="text-slate-300">
              API: {backendStatus?.status === "healthy" ? "FastAPI Online" : "Ready"}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {backendStatus?.gemini_configured ? "Google Gemini Live" : "AI Intelligence Mode"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    isActive ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
