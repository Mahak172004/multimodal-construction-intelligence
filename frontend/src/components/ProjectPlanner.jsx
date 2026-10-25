import React, { useState } from "react";
import { 
  CalendarRange, 
  Clock, 
  Layers, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { planProjectApi } from "../services/api";

export default function ProjectPlanner() {
  const [formData, setFormData] = useState({
    project_title: "TechPark Horizon Phase 2",
    project_type: "Commercial Office Complex",
    total_area_sqft: 60000,
    budget: 5200000,
    target_duration_months: 16,
    location: "Metro Downtown Business District",
    priority: "Quality / Durability"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleGeneratePlan = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await planProjectApi(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate project plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarRange className="w-6 h-6 text-amber-500" />
              Construction Project Planning & WBS Scheduling Engine
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              AI-driven Critical Path Method (CPM), multi-phase work breakdown structure, trade resource allocation, and risk management.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 self-start md:self-auto">
            CPM & PMP Standard
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Project Scope Parameters
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
              <input
                type="text"
                value={formData.project_title}
                onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Type</label>
              <select
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option>Commercial Office Complex</option>
                <option>High-Rise Residential</option>
                <option>Single Family Luxury Villa</option>
                <option>Industrial Logistics Warehouse</option>
                <option>Bridge / Infrastructure Works</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Area (sq.ft)</label>
                <input
                  type="number"
                  value={formData.total_area_sqft}
                  onChange={(e) => setFormData({ ...formData, total_area_sqft: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Budget ($)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Months</label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={formData.target_duration_months}
                  onChange={(e) => setFormData({ ...formData, target_duration_months: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>Speed & Fast-Tracking</option>
                  <option>Quality / Durability</option>
                  <option>Strict Cost Minimization</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Site Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating CPM Timeline & WBS...
                </>
              ) : (
                <>
                  <CalendarRange className="w-4 h-4" />
                  Generate AI Project Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Schedule Output */}
        <div className="lg:col-span-8 space-y-4">
          {!result && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                <CalendarRange className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">Awaiting Scope Definition</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Click "Generate AI Project Plan" to compute critical path tasks, work breakdown phases, labor force allocation, and risk buffers.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-800">Synthesizing Project Schedule...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Evaluating lead times, fast-tracking dependencies, allocating trade crafts, and establishing risk mitigation strategies.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Executive Overview */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Master Schedule Overview
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {result.project_title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                      {result.estimated_completion_weeks} Weeks Estimated
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                  {result.project_summary}
                </p>

                {/* Critical Path Bar */}
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-xs font-bold text-red-950 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-red-600" />
                    Critical Path Items (Zero Float Tolerances)
                  </h4>
                  <ul className="space-y-1 text-xs text-red-900">
                    {result.critical_path_items?.map((cp, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                        <span>{cp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Phased WBS Timeline */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Work Breakdown Structure (WBS) & Phased Gantt Sequencing
                </h4>
                <div className="space-y-3">
                  {result.phases?.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-2 hover:bg-white transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {p.phase_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            Weeks {p.start_week} - {p.end_week} ({p.duration_weeks} wks)
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                            Budget: {p.budget_allocation_pct}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-slate-500">Key Deliverables:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.key_deliverables?.map((deliv, dIdx) => (
                            <span key={dIdx} className="bg-white px-2 py-1 rounded border border-slate-200 text-[11px] text-slate-700">
                              ✓ {deliv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {p.dependencies && p.dependencies.length > 0 && (
                        <p className="text-[10px] text-slate-500">
                          <span className="font-medium text-slate-600">Dependencies:</span> {p.dependencies.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Allocations & Risk Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Resources */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-500" />
                    Key Labor & Equipment Allocation
                  </h4>
                  <div className="space-y-2 text-xs">
                    {result.resource_allocations?.map((res, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{res.role}</p>
                          <p className="text-[10px] text-slate-500">Peak: {res.peak_phase}</p>
                        </div>
                        <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                          {res.count} Heads
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Mitigation */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Risk Mitigation Matrix
                  </h4>
                  <div className="space-y-2 text-xs">
                    {result.risk_mitigation_plan?.map((r, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-[11px] truncate max-w-[200px]">{r.risk}</span>
                          <span className="text-[10px] font-bold text-amber-700">
                            {r.likelihood} / {r.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {r.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
