import React, { useState } from "react";
import { 
  CloudSun, 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ShieldAlert,
  Flame,
  CloudRain
} from "lucide-react";
import { getWeatherAdvisoryApi } from "../services/api";

const WEATHER_PRESETS = [
  {
    name: "High Wind Alert",
    location: "Bay Coastal District",
    temp: 21,
    precip: "None",
    wind: 48,
    humidity: 55,
    activities: ["Tower Crane Lifting & Rigging", "Exterior Scaffolding Work", "Interior Drywall Installation"]
  },
  {
    name: "Severe Rain & Storm",
    location: "Metro North River Valley",
    temp: 16,
    precip: "Heavy Rain / Storm",
    wind: 36,
    humidity: 92,
    activities: ["Structural Concrete Pouring", "Excavation & Trenching", "Exterior Painting"]
  },
  {
    name: "Extreme Heat Wave",
    location: "South Valley Project",
    temp: 40,
    precip: "None",
    wind: 14,
    humidity: 28,
    activities: ["Structural Concrete Pouring", "Roofing Waterproofing", "Steel Column Erection"]
  },
  {
    name: "Optimal Mild Conditions",
    location: "Central Hills Zone",
    temp: 22,
    precip: "None",
    wind: 12,
    humidity: 50,
    activities: ["Structural Concrete Pouring", "Tower Crane Lifting & Rigging", "Exterior Painting"]
  }
];

const COMMON_ACTIVITIES = [
  "Structural Concrete Pouring",
  "Tower Crane Lifting & Rigging",
  "Exterior Scaffolding Work",
  "Excavation & Trenching",
  "Exterior Painting & Waterproofing",
  "Roofing Membrane Heat Sealing",
  "High-Voltage Electrical Tie-in"
];

export default function WeatherAdvisory() {
  const [formData, setFormData] = useState({
    location: WEATHER_PRESETS[0].location,
    temperature_c: WEATHER_PRESETS[0].temp,
    precipitation_risk: WEATHER_PRESETS[0].precip,
    wind_speed_kmh: WEATHER_PRESETS[0].wind,
    humidity_pct: WEATHER_PRESETS[0].humidity,
    planned_activities: WEATHER_PRESETS[0].activities
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const applyPreset = (preset) => {
    setFormData({
      location: preset.location,
      temperature_c: preset.temp,
      precipitation_risk: preset.precip,
      wind_speed_kmh: preset.wind,
      humidity_pct: preset.humidity,
      planned_activities: preset.activities
    });
    setResult(null);
  };

  const toggleActivity = (act) => {
    setFormData((prev) => {
      const exists = prev.planned_activities.includes(act);
      return {
        ...prev,
        planned_activities: exists
          ? prev.planned_activities.filter((a) => a !== act)
          : [...prev.planned_activities, act]
      };
    });
  };

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherAdvisoryApi(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to evaluate weather risks.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "prohibited":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "restricted":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "caution":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-amber-500" />
              Weather-Aware Site Advisory & Meteorological Safety Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Automated compatibility matrix for scheduled tasks against live weather thresholds (crane wind limits, hot/cold concrete hydration, slip risk).
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 self-start md:self-auto">
            ANSI / OSHA Meteorological Safe-Limits
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-amber-500" />
            Weather Parameters & Activities
          </h3>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Simulate Weather Conditions:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WEATHER_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2 rounded-lg text-left text-xs border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all"
                >
                  <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {p.temp}°C, {p.wind} km/h wind
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Site Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-red-500" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature_c}
                  onChange={(e) => setFormData({ ...formData, temperature_c: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-blue-500" />
                  Wind Speed (km/h)
                </label>
                <input
                  type="number"
                  value={formData.wind_speed_kmh}
                  onChange={(e) => setFormData({ ...formData, wind_speed_kmh: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  Relative Humidity (%)
                </label>
                <input
                  type="number"
                  value={formData.humidity_pct}
                  onChange={(e) => setFormData({ ...formData, humidity_pct: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Precipitation</label>
                <select
                  value={formData.precipitation_risk}
                  onChange={(e) => setFormData({ ...formData, precipitation_risk: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>None</option>
                  <option>Light Rain</option>
                  <option>Heavy Rain / Storm</option>
                  <option>Snow / Freezing</option>
                </select>
              </div>
            </div>

            {/* Activities Checkboxes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Planned Shift Activities ({formData.planned_activities.length} selected):
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {COMMON_ACTIVITIES.map((act) => {
                  const isChecked = formData.planned_activities.includes(act);
                  return (
                    <button
                      type="button"
                      key={act}
                      onClick={() => toggleActivity(act)}
                      className={`w-full flex items-center justify-between p-1.5 rounded text-left transition-all ${
                        isChecked ? "bg-amber-50 text-amber-950 font-medium" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-[11px]">{act}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isChecked ? "bg-amber-200 text-amber-900" : "bg-slate-200 text-slate-600"}`}>
                        {isChecked ? "Active" : "Skip"}
                      </span>
                    </button>
                  );
                })}
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
                  Auditing Weather Hazard Envelope...
                </>
              ) : (
                <>
                  <CloudSun className="w-4 h-4" />
                  Evaluate Weather Safety Risks
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                <CloudSun className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">Awaiting Weather Evaluation</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a preset or input local weather readings to determine activity go/no-go decisions, crane wind interlocks, and hydration precautions.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-800">Assessing Meteorological Threat Vectors...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Auditing crane boom load charts, plastic shrinkage evaporation rates, and OSHA lightning protocols.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Overall Banner */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Overall Site Workability Decision
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {result.overall_site_workability}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(result.overall_site_workability)}`}>
                    {result.overall_site_workability}
                  </span>
                </div>

                <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {result.advisory_summary}
                </p>
              </div>

              {/* Activity Assessment Cards */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Task Compatibility & Safety Protocols
                </h4>
                <div className="space-y-2.5">
                  {result.activity_assessments?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-2 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.activity}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        <span className="font-semibold text-slate-700">Reason:</span> {item.reason}
                      </p>
                      <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-800">
                        <span className="font-semibold text-amber-900">Mandatory Safety Protocol: </span>
                        {item.safety_protocol}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Weather Measures */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Site Preparedness & Storm Mitigation Steps
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {result.emergency_weather_measures?.map((m, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 border border-slate-100 rounded flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{m}</span>
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
