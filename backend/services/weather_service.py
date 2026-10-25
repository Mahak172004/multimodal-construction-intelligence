from backend.models.schemas import WeatherAdvisoryRequest, WeatherAdvisoryResponse, ActivityAssessment
from backend.services.gemini_service import gemini_service

WEATHER_PROMPT = """
You are a Construction Safety & Meteorology Risk Officer.
Assess the impact of current/forecasted weather on scheduled site activities:
Location: {location}
Temperature: {temp}°C
Precipitation Risk: {precipitation}
Wind Speed: {wind} km/h
Relative Humidity: {humidity}%
Planned Activities: {activities}

Return ONLY a JSON object matching this schema:
{{
  "overall_site_workability": "<Optimal | Proceed with Caution | High Risk / Selective Stoppage | Shutdown Recommended>",
  "advisory_summary": "<summary of meteorological impact on active operations>",
  "activity_assessments": [
    {{
      "activity": "<Activity Name>",
      "status": "<Allowed | Caution | Restricted | Prohibited>",
      "reason": "<Meteorological rationale>",
      "safety_protocol": "<Required precaution or mitigation code>"
    }}
  ],
  "emergency_weather_measures": [
    "<Measure 1>",
    "<Measure 2>"
  ]
}}
"""

async def evaluate_weather_risks(req: WeatherAdvisoryRequest) -> WeatherAdvisoryResponse:
    prompt = WEATHER_PROMPT.format(
        location=req.location,
        temp=req.temperature_c,
        precipitation=req.precipitation_risk,
        wind=req.wind_speed_kmh,
        humidity=req.humidity_pct,
        activities=", ".join(req.planned_activities)
    )

    if gemini_service.is_configured():
        gemini_data = await gemini_service.generate_json(prompt)
        if gemini_data:
            try:
                return WeatherAdvisoryResponse(**gemini_data)
            except Exception:
                pass

    # Heuristic evaluation based on civil engineering weather criteria
    is_high_wind = req.wind_speed_kmh >= 38.0  # OSHA crane limit is typically 20-30 mph (~32-48 km/h)
    is_rain = "rain" in req.precipitation_risk.lower() or "storm" in req.precipitation_risk.lower()
    is_heavy_rain = "heavy" in req.precipitation_risk.lower() or "storm" in req.precipitation_risk.lower()
    is_hot = req.temperature_c >= 35.0
    is_freezing = req.temperature_c <= 4.0

    assessments = []
    for act in req.planned_activities:
        act_lower = act.lower()
        if "crane" in act_lower or "lifting" in act_lower:
            if is_high_wind:
                status = "Prohibited"
                reason = f"Wind gusts ({req.wind_speed_kmh} km/h) exceed safe crane boom operational limits (ANSI B30.5)."
                protocol = "Luff boom down, secure hook blocks, and disable tower slewing clutches."
            elif req.wind_speed_kmh > 25:
                status = "Caution"
                reason = "Moderate wind gusts detected; risk of load swing."
                protocol = "Use dual taglines and restrict high-surface-area panel lifts."
            else:
                status = "Allowed"
                reason = "Wind velocity within optimal operational envelope."
                protocol = "Follow standard 360-degree lift path clearance."

        elif "concrete" in act_lower or "pour" in act_lower:
            if is_heavy_rain:
                status = "Prohibited"
                reason = "Heavy rain will wash out cement paste, alter water-cement ratio, and ruin surface finish."
                protocol = "Postpone pour; secure waterproof tarpaulins over freshly cast slabs."
            elif is_hot:
                status = "Caution"
                reason = f"High temperature ({req.temperature_c}°C) accelerates hydration, risking plastic shrinkage cracks."
                protocol = "Use chilled mixing water, liquid nitrogen, and apply curing compound immediately."
            elif is_freezing:
                status = "Caution"
                reason = "Low temperature risks freezing fresh concrete prior to reaching 500 psi strength."
                protocol = "Deploy insulated curing blankets and space heaters (ACI 306R Cold Weather)."
            else:
                status = "Allowed"
                reason = "Favorable ambient temperature and humidity for standard hydration curing."
                protocol = "Standard wet burlap or membrane curing regime."

        elif "roofing" in act_lower or "height" in act_lower or "scaffold" in act_lower:
            if is_high_wind or is_rain:
                status = "Prohibited"
                reason = "Slippery wet surfaces combined with wind gusts create severe slip-and-fall hazards."
                protocol = "Clear all personnel from elevated staging decks; lock ladder access hatches."
            else:
                status = "Allowed"
                reason = "Dry conditions with safe wind parameters."
                protocol = "Mandatory 100% harness hook-up to independent safety lifelines."

        elif "paint" in act_lower or "coating" in act_lower:
            if is_rain or req.humidity_pct > 80:
                status = "Restricted"
                reason = f"High humidity ({req.humidity_pct}%) or precipitation prevents coating adhesion and curing."
                protocol = "Confine painting to indoor temperature-controlled zones with exhaust ventilation."
            else:
                status = "Allowed"
                reason = "Moisture parameters within manufacturer tolerance."
                protocol = "Verify surface moisture meter reading < 4% before application."

        else:
            if is_heavy_rain:
                status = "Restricted"
                reason = "Inclement conditions hinder site traction and vision."
                protocol = "Wear foul-weather high-visibility PPE and monitor ground stability."
            else:
                status = "Allowed"
                reason = "Weather conditions compatible with scheduled operations."
                protocol = "Maintain routine job hazard analysis (JHA)."

        assessments.append(ActivityAssessment(
            activity=act,
            status=status,
            reason=reason,
            safety_protocol=protocol
        ))

    overall = "Optimal"
    if any(a.status == "Prohibited" for a in assessments):
        overall = "High Risk / Selective Stoppage" if not is_heavy_rain else "Shutdown Recommended"
    elif any(a.status in ["Caution", "Restricted"] for a in assessments):
        overall = "Proceed with Caution"

    return WeatherAdvisoryResponse(
        overall_site_workability=overall,
        advisory_summary=f"Site conditions at {req.location} evaluated at {req.temperature_c}°C, {req.wind_speed_kmh} km/h wind, {req.humidity_pct}% humidity with {req.precipitation_risk.lower()} precipitation forecast. Status: {overall}.",
        activity_assessments=assessments,
        emergency_weather_measures=[
            "Inspect site perimeter stormwater retention basins and sump pump discharge lines.",
            "Verify tiedowns for all loose plywood sheets, scaffolding planks, and temporary site signage.",
            "Designate on-site lightning / high-wind muster assembly zones for ground and elevated personnel."
        ]
    )
