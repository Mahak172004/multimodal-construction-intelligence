import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  UploadCloud, 
  Users, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Loader2, 
  Camera, 
  Info,
  ChevronRight
} from "lucide-react";
import { inspectSafetyApi } from "../services/api";

// Sample base64-like placeholder images or SVG visual presets
const DEMO_PRESETS = [
  {
    name: "Elevated Framing & Edge Work",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80",
    notes: "Level 2 east perimeter framing. High wind gust conditions."
  },
  {
    name: "Mobile Crane Staging Yard",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    notes: "Ground staging area with active backhoe and crane boom movement."
  },
  {
    name: "Excavation & Trench Shoring",
    url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    notes: "Substructure footing depth 3.5m. Soil type C moisture check."
  }
];

export default function SafetyMonitor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(DEMO_PRESETS[0].url);
  const [notes, setNotes] = useState(DEMO_PRESETS[0].notes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const loadPreset = async (preset) => {
    setPreviewUrl(preset.url);
    setNotes(preset.notes);
    setSelectedFile(null);
    setError(null);
  };

  const handleInspect = async () => {
    setLoading(true);
    setError(null);
    try {
      let fileToUpload = selectedFile;
      if (!fileToUpload) {
        // Fetch demo preset image as blob
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        fileToUpload = new File([blob], "site_inspection.jpg", { type: "image/jpeg" });
      }

      const data = await inspectSafetyApi(fileToUpload, notes);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to inspect site safety.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-rose-600 text-white border-rose-700";
      case "high":
        return "bg-amber-600 text-white border-amber-700";
      case "medium":
        return "bg-yellow-500 text-slate-900 border-yellow-600";
      default:
        return "bg-emerald-600 text-white border-emerald-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              Construction Site Safety & PPE Vision Monitoring
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Multimodal AI audit for personal protective equipment (PPE), unguarded edge fall hazards, scaffolding stability, and OSHA compliance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
              OSHA 29 CFR 1926 Aligned
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
              Multimodal Vision AI
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Inspection Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Input & Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-500" />
              Site Imagery Input
            </h3>

            {/* Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Quick Demonstration Scenarios:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadPreset(p)}
                    className={`p-2 rounded-lg text-left text-xs border transition-all ${
                      previewUrl === p.url
                        ? "border-amber-500 bg-amber-50/50 text-amber-950 font-semibold"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Preset {idx + 1}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Box */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer transition-colors group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-amber-500 transition-colors" />
                <p className="text-xs font-medium text-slate-700">
                  {selectedFile ? selectedFile.name : "Click or drag site photo to inspect"}
                </p>
                <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP from CCTV or Field Mobiles</p>
              </div>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-inner">
                <img
                  src={previewUrl}
                  alt="Site inspection preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur">
                  Ready for AI Inspection
                </span>
              </div>
            )}

            {/* Inspector Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inspector Context / Location Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Scaffolding level 3, wet conditions, high noise level..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleInspect}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Multimodal Safety Vision Audit...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Execute AI Safety Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Inspection Output */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">No Safety Audit Performed Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select an inspection preset or upload a site image, then click "Execute AI Safety Audit" to generate real-time PPE and OSHA hazard assessments.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-800">Analyzing Construction Site Imagery...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Evaluating worker PPE compliance, leading-edge fall protection, heavy machinery clearance zones, and OSHA 1926 standards.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Scorecard Overview */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Overall Site Risk Rating
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getRiskBadgeColor(result.risk_level)}`}>
                        {result.risk_level} Risk Level
                      </span>
                      <span className="text-2xl font-black text-slate-900">
                        {result.overall_risk_score}
                        <span className="text-xs font-normal text-slate-400">/100 Index</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                    <Users className="w-4 h-4 text-slate-600" />
                    <div>
                      <p className="text-[11px] text-slate-500">Personnel Detected</p>
                      <p className="text-sm font-bold text-slate-800">{result.workers_detected_count || 0} Workers</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-3.5 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  <span className="font-semibold text-amber-900">Executive Summary: </span>
                  {result.summary}
                </p>
              </div>

              {/* PPE Compliance Matrix */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>PPE Compliance Audit</span>
                  <span className="text-[11px] font-normal text-slate-400">OSHA 1926 Subpart E</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {result.ppe_compliance?.map((item, idx) => {
                    const isOk = item.status === "Compliant";
                    const isViol = item.status === "Violation";
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                          isOk
                            ? "bg-emerald-50/40 border-emerald-200"
                            : isViol
                            ? "bg-rose-50/50 border-rose-200"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        {isOk ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : isViol ? (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-slate-900">{item.item}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                isOk
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isViol
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] leading-snug">{item.details}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detected Hazards */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Site Hazards & Corrective Engineering Recommendations
                </h4>
                <div className="space-y-2.5">
                  {result.hazards_detected?.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-2 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          {h.hazard}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            h.severity === "Critical"
                              ? "bg-rose-100 text-rose-800"
                              : h.severity === "High"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {h.severity} Severity
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">Location:</span> {h.location}
                      </p>
                      <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                        <span className="font-semibold text-slate-900">Corrective Action: </span>
                        {h.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & OSHA References */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Immediate Action Checklist
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {result.immediate_actions_required?.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    OSHA Standards Enforced
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {result.osha_standards_referenced?.map((std, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 font-mono text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{std}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
