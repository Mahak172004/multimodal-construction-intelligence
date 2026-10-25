import React, { useState } from "react";
import { 
  ClipboardList, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Loader2, 
  Sparkles,
  Calendar
} from "lucide-react";
import { summarizeSiteLogApi } from "../services/api";

export default function DailySiteLogs() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    site_name: "Metropolis High-Rise Tower B",
    superintendent_name: "Marcus Vance, PE",
    worker_count: 42,
    work_completed: "Completed Level 4 post-tension slab reinforcement rebar tying. Poured 180 cu.m of M40 grade concrete between gridlines C-F. Commenced drywall framing on Level 2 interior suites.",
    materials_received: "18 truckloads ready-mix concrete, 25 tons deformed rebar bundles (Grade 60), 450 sheets gypsum board.",
    equipment_deployed: "Tower Crane #1 (active 7 hrs), 2 concrete boom pump trucks, 4 rotary concrete vibrators, 1 scissor lift.",
    delays_or_impediments: "Concrete batching plant dispatch delayed by 45 minutes during morning peak hour traffic.",
    safety_incidents_notes: "Zero lost-time injuries. One minor near-miss: unbolted toe-board adjusted immediately during morning safety audit."
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSummarize = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await summarizeSiteLogApi(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to process site log.");
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
              <ClipboardList className="w-6 h-6 text-amber-500" />
              Daily Site Operations & Executive AI Briefing
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Field log aggregation, productivity scoring, equipment utilization tracking, and automated executive daily briefings.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 self-start md:self-auto">
            Superintendent Field System
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Log Form */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-500" />
            Field Superintendent Daily Entry
          </h3>

          <form onSubmit={handleSummarize} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">On-Site Headcount</label>
                <input
                  type="number"
                  value={formData.worker_count}
                  onChange={(e) => setFormData({ ...formData, worker_count: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Site / Project</label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Superintendent</label>
                <input
                  type="text"
                  value={formData.superintendent_name}
                  onChange={(e) => setFormData({ ...formData, superintendent_name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Tasks Completed</label>
              <textarea
                rows={2}
                value={formData.work_completed}
                onChange={(e) => setFormData({ ...formData, work_completed: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Materials Delivered</label>
              <textarea
                rows={2}
                value={formData.materials_received}
                onChange={(e) => setFormData({ ...formData, materials_received: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Heavy Machinery Deployed</label>
              <textarea
                rows={2}
                value={formData.equipment_deployed}
                onChange={(e) => setFormData({ ...formData, equipment_deployed: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delays / Roadblocks</label>
                <input
                  type="text"
                  value={formData.delays_or_impediments}
                  onChange={(e) => setFormData({ ...formData, delays_or_impediments: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Safety Notes</label>
                <input
                  type="text"
                  value={formData.safety_incidents_notes}
                  onChange={(e) => setFormData({ ...formData, safety_incidents_notes: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>
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
                  Generating Executive Briefing...
                </>
              ) : (
                <>
                  <ClipboardList className="w-4 h-4" />
                  Generate Executive Daily Briefing
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">Awaiting Daily Log Submission</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Submit superintendent notes to generate an AI-synthesized executive brief, productivity evaluation, and next-day action plan.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-800">Compiling Daily Operations Intel...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Evaluating trade labor productivity, equipment runtime ratios, and schedule delta indicators.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Executive Summary Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Executive Shift Intelligence
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {formData.site_name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Compliance: {result.compliance_rating}
                  </span>
                </div>

                <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {result.executive_summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200">
                    <p className="text-[11px] font-semibold text-amber-900">Milestone Progress Impact</p>
                    <p className="text-xs font-bold text-amber-950 mt-0.5">{result.milestone_progress_estimate}</p>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <p className="text-[11px] font-semibold text-blue-900">Productivity Evaluation</p>
                    <p className="text-xs font-bold text-blue-950 mt-0.5">{result.productivity_assessment}</p>
                  </div>
                </div>
              </div>

              {/* Critical Issues Flagged */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Critical Bottlenecks & Safety Flags
                </h4>
                <div className="space-y-2 text-xs">
                  {result.critical_issues_flagged?.map((issue, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tomorrow's Action Plan */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Prioritized Action Items for Next Shift
                </h4>
                <div className="space-y-2 text-xs">
                  {result.action_items_for_tomorrow?.map((act, idx) => (
                    <div key={idx} className="p-2.5 bg-emerald-50/40 border border-emerald-200 rounded text-slate-800 flex items-start gap-2">
                      <span className="font-bold text-emerald-700 shrink-0">{idx + 1}.</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
