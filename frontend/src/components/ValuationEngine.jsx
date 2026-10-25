import React, { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  PieChart, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  Loader2, 
  CheckSquare, 
  Square
} from "lucide-react";
import { calculateValuationApi } from "../services/api";

const ALL_AMENITIES = [
  "Underground Multi-level Parking",
  "High-speed Destination Elevators",
  "Rooftop Solar PV Grid",
  "Rainwater Harvesting & Recycling",
  "BMS Smart Energy Automation",
  "LEED Gold / Platinum Efficiency Standard",
  "Seismic Damper Vibration Isolation"
];

export default function ValuationEngine() {
  const [formData, setFormData] = useState({
    project_name: "Apex SkyView Commercial Tower",
    property_type: "Commercial",
    location_tier: "Tier 1 Urban / Metro",
    city_zone: "Central Business District",
    total_builtup_area_sqft: 45000,
    num_floors: 12,
    construction_quality: "Premium / Deluxe",
    current_stage: "Structure / Framing Complete",
    amenities: [
      "Underground Multi-level Parking",
      "High-speed Destination Elevators",
      "Rooftop Solar PV Grid"
    ],
    market_appreciation_rate_pct: 8.5
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await calculateValuationApi(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to calculate valuation.");
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
              <TrendingUp className="w-6 h-6 text-amber-500" />
              Real Estate Valuation & Quantity Surveying Cost Engine
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Automated cost forecasting, cost-to-complete estimation, asset capitalization valuation, and ROI risk modeling.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 self-start md:self-auto">
            Quantity Surveying Standard
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-500" />
            Project Specifications
          </h3>

          <form onSubmit={handleCalculate} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                <select
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Mixed-Use</option>
                  <option>Industrial</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Tier</label>
                <select
                  value={formData.location_tier}
                  onChange={(e) => setFormData({ ...formData, location_tier: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>Tier 1 Urban / Metro</option>
                  <option>Tier 2 City</option>
                  <option>Suburban</option>
                  <option>Rural / Industrial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Built-Up Area (sq.ft)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={formData.total_builtup_area_sqft}
                  onChange={(e) => setFormData({ ...formData, total_builtup_area_sqft: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Number of Floors</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.num_floors}
                  onChange={(e) => setFormData({ ...formData, num_floors: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specification Quality</label>
                <select
                  value={formData.construction_quality}
                  onChange={(e) => setFormData({ ...formData, construction_quality: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>Standard / Affordable</option>
                  <option>Premium / Deluxe</option>
                  <option>Luxury / High-End</option>
                  <option>Ultra-Luxury</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Stage</label>
                <select
                  value={formData.current_stage}
                  onChange={(e) => setFormData({ ...formData, current_stage: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>Pre-construction / Bare Land</option>
                  <option>Foundation Complete</option>
                  <option>Structure / Framing Complete</option>
                  <option>Finishing Stage</option>
                  <option>Fully Completed</option>
                </select>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Key Premium Amenities ({formData.amenities.length} selected)
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {ALL_AMENITIES.map((am) => {
                  const isChecked = formData.amenities.includes(am);
                  return (
                    <button
                      type="button"
                      key={am}
                      onClick={() => toggleAmenity(am)}
                      className={`w-full flex items-center gap-2 p-1.5 rounded text-left transition-all ${
                        isChecked ? "bg-amber-50 text-amber-950 font-medium" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="text-[11px] truncate">{am}</span>
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
                  Calculating Financials & Cost Vectors...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Run AI Valuation & Cost Model
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results View */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                <DollarSign className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">Ready to Compute Valuation</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Configure your project parameters or keep default values, then click "Run AI Valuation & Cost Model" to generate cost breakdowns, asset values, and ROI forecasts.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px]">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-800">Synthesizing Quantity Surveying Metrics...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Appraising structural framing costs, MEP density indices, market capitalizations, and residual cost-to-complete.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Primary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Estimated Total Cost</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    ${result.estimated_total_cost.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">${result.cost_per_sqft}/sq.ft</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Projected Market Value</span>
                  <p className="text-lg font-bold text-emerald-700 mt-1">
                    ${result.current_market_value.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">${result.value_per_sqft}/sq.ft</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Projected ROI</span>
                  <p className="text-lg font-bold text-blue-700 mt-1 flex items-center gap-1">
                    +{result.projected_roi_percentage}%
                    <ArrowUpRight className="w-4 h-4 text-blue-600" />
                  </p>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    Risk: {result.investment_risk_score}
                  </span>
                </div>
              </div>

              {/* Cost to complete highlight */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-950">Residual Cost-to-Complete</p>
                  <p className="text-xs text-amber-800">Remaining capital commitment required to achieve final occupancy</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-amber-900">
                    ${result.cost_to_complete.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Work Breakdown Progress Bars */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-amber-500" />
                  Quantity Surveying Cost Distribution
                </h4>
                <div className="space-y-2.5 text-xs">
                  {Object.entries(result.cost_breakdown || {}).map(([cat, amt]) => {
                    const pct = Math.round((amt / result.estimated_total_cost) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-slate-700 font-medium">
                          <span>{cat}</span>
                          <span className="text-slate-900 font-bold">
                            ${amt.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Market Intelligence Insights */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI Real Estate Intelligence & Valuation Insights
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {result.market_trends_and_insights?.map((insight, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        •
                      </span>
                      <p className="leading-relaxed">{insight}</p>
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
