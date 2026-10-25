import React, { useState } from "react";
import { 
  Search, 
  AlertOctagon, 
  UploadCloud, 
  Wrench, 
  Layers, 
  Loader2, 
  Camera, 
  Activity, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { analyzeCrackApi } from "../services/api";

const CRACK_PRESETS = [
  {
    name: "Shear Crack in Column Support",
    url: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
    notes: "Main transfer beam junction, level 1. Diagonal pattern at ~45 degrees."
  },
  {
    name: "Hairline Shrinkage in Fresh Slab",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    notes: "Cast 48 hours ago. Hot weather exposure, wind drying observed."
  },
  {
    name: "Basement Foundation Wall Settlement",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    notes: "Subgrade perimeter wall with seasonal groundwater pressure."
  }
];

export default function CrackAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(CRACK_PRESETS[0].url);
  const [notes, setNotes] = useState(CRACK_PRESETS[0].notes);
  const [memberType, setMemberType] = useState("Reinforced Concrete Beam / Column");
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

  const loadPreset = (preset) => {
    setPreviewUrl(preset.url);
    setNotes(preset.notes);
    setSelectedFile(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      let fileToUpload = selectedFile;
      if (!fileToUpload) {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        fileToUpload = new File([blob], "crack_analysis.jpg", { type: "image/jpeg" });
      }

      const combinedNotes = `Structural Element: ${memberType}. Notes: ${notes}`;
      const data = await analyzeCrackApi(fileToUpload, combinedNotes);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to analyze crack defect.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-rose-600 text-white";
      case "severe":
        return "bg-red-500 text-white";
      case "moderate":
        return "bg-amber-500 text-slate-900";
      default:
        return "bg-emerald-600 text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-6 h-6 text-amber-500" />
              Crack Detection & Structural Defect Forensic Analysis
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Multimodal computer vision for concrete crack classification, shear vs shrinkage diagnosis, width estimation, and structural remediation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
              ACI 224R / ASTM C881 Aligned
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-500" />
              Defect Photo Input
            </h3>

            {/* Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Pre-configured Defect Presets:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CRACK_PRESETS.map((p, idx) => (
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

            {/* Upload Zone */}
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
                  {selectedFile ? selectedFile.name : "Upload concrete / masonry crack photo"}
                </p>
                <p className="text-[11px] text-slate-400">High-resolution close-ups improve width precision</p>
              </div>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-inner">
                <img
                  src={previewUrl}
                  alt="Crack preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur">
                  Optical Surface Scan
                </span>
              </div>
            )}

            {/* Structural Member */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Structural Element Type:
              </label>
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option>Reinforced Concrete Beam / Column</option>
                <option>Floor Slab / Elevated Deck</option>
                <option>Foundation Footing & Retaining Wall</option>
                <option>Masonry / Brick Infill Wall</option>
                <option>Pre-cast Concrete Panel</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Field Observations & History:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Observed water seepage, vibrations, or recent loading changes..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Defect Morphology & Stress Vectors...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Run AI Structural Diagnosis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">Awaiting Defect Image</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a defect scenario or upload an image to receive forensic engineering classification, structural integrity hazard levels, and epoxy remediation steps.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-800">Performing Structural Forensic Analysis...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Measuring crack aperture, vector trajectory, evaluating shear stress concentration, and calculating remediation protocols.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Classification Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Forensic Classification
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {result.defect_type}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${getSeverityBadge(result.severity)}`}>
                      {result.severity} Severity
                    </span>
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-900 text-white">
                      Risk: {result.structural_integrity_risk}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500">Estimated Aperture Width</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{result.estimated_width_mm}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500">Depth / Penetration</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{result.estimated_depth_estimate}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                    <p className="text-[11px] text-slate-500">Monitoring Cadence</p>
                    <p className="text-xs font-bold text-amber-700 mt-0.5 truncate">{result.monitoring_interval}</p>
                  </div>
                </div>

                {/* Impact */}
                <div className="mt-4 p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    Structural Load & Integrity Impact
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {result.structural_impact}
                  </p>
                </div>
              </div>

              {/* Probable Causes */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Probable Root Causes (Materials & Mechanics)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.probable_causes?.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Remediation */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  Engineered Remediation & Repair Roadmap
                </h4>
                <div className="space-y-2.5">
                  {result.recommended_remediation?.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-2 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Step {step.step}: Repair Action
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            Urgency: {step.urgency}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                            Cost: {step.estimated_cost_tier}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {step.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preventive Measures */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Preventive Maintenance & Durability Controls
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {result.preventive_measures?.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-[11px]">{m}</span>
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
