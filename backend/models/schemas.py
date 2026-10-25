from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ----------------- Safety Monitoring Schemas -----------------
class PPEComplianceItem(BaseModel):
    item: str
    status: str = Field(description="Compliant, Violation, or Not Observed")
    details: str

class HazardItem(BaseModel):
    hazard: str
    severity: str = Field(description="Low, Medium, High, or Critical")
    location: str
    recommendation: str

class SafetyInspectionResponse(BaseModel):
    overall_risk_score: int = Field(ge=0, le=100, description="0-100 risk score where 100 is hazardous")
    risk_level: str = Field(description="Low, Medium, High, or Critical")
    summary: str
    workers_detected_count: Optional[int] = 0
    ppe_compliance: List[PPEComplianceItem]
    hazards_detected: List[HazardItem]
    osha_standards_referenced: List[str]
    immediate_actions_required: List[str]

# ----------------- Crack & Structural Defect Schemas -----------------
class RemediationStep(BaseModel):
    step: int
    action: str
    urgency: str = Field(description="Immediate, Within 7 Days, Within 30 Days, Routine Monitoring")
    estimated_cost_tier: str = Field(description="Low, Moderate, High, Substantial")

class CrackAnalysisResponse(BaseModel):
    defect_type: str = Field(description="e.g. Hairline Shrinkage Crack, Structural Shear Crack, Settlement Crack, Spalling")
    severity: str = Field(description="Minor, Moderate, Severe, Critical")
    structural_integrity_risk: str = Field(description="Low, Medium, High, Dangerous")
    estimated_width_mm: str
    estimated_depth_estimate: str
    probable_causes: List[str]
    structural_impact: str
    recommended_remediation: List[RemediationStep]
    preventive_measures: List[str]
    monitoring_interval: str

# ----------------- Real Estate Valuation Schemas -----------------
class ValuationRequest(BaseModel):
    project_name: str = "Grand Horizon Residency"
    property_type: str = "Residential"  # Residential, Commercial, Mixed-Use, Industrial
    location_tier: str = "Tier 1 Urban / Metro"
    city_zone: str = "Central Business District"
    total_builtup_area_sqft: float = 25000.0
    num_floors: int = 8
    construction_quality: str = "Premium / Deluxe"
    current_stage: str = "Structure / Framing Complete"
    amenities: List[str] = ["Underground Parking", "High-speed Elevators", "Solar Power Grid", "Rainwater Harvesting"]
    market_appreciation_rate_pct: float = 7.5

class ValuationResponse(BaseModel):
    project_name: str
    estimated_total_cost: float
    cost_per_sqft: float
    current_market_value: float
    value_per_sqft: float
    cost_to_complete: float
    projected_roi_percentage: float
    investment_risk_score: str
    cost_breakdown: Dict[str, float]
    valuation_multipliers: Dict[str, float]
    market_trends_and_insights: List[str]

# ----------------- Project Planning Schemas -----------------
class ProjectPlanRequest(BaseModel):
    project_title: str = "TechPark Tower A"
    project_type: str = "Commercial Office Complex"
    total_area_sqft: float = 50000.0
    budget: float = 4500000.0
    target_duration_months: int = 14
    location: str = "Metro Business District"
    priority: str = "Quality / Durability"

class PlanPhase(BaseModel):
    phase_name: str
    duration_weeks: int
    start_week: int
    end_week: int
    key_deliverables: List[str]
    dependencies: List[str]
    budget_allocation_pct: float

class ResourceAllocation(BaseModel):
    role: str
    count: int
    peak_phase: str

class RiskItem(BaseModel):
    risk: str
    likelihood: str
    impact: str
    mitigation: str

class ProjectPlanResponse(BaseModel):
    project_title: str
    project_summary: str
    estimated_completion_weeks: int
    critical_path_items: List[str]
    phases: List[PlanPhase]
    resource_allocations: List[ResourceAllocation]
    risk_mitigation_plan: List[RiskItem]

# ----------------- Daily Site Log Schemas -----------------
class DailyLogRequest(BaseModel):
    date: str
    site_name: str
    superintendent_name: str
    worker_count: int
    work_completed: str
    materials_received: str
    equipment_deployed: str
    delays_or_impediments: str
    safety_incidents_notes: str

class DailyLogResponse(BaseModel):
    executive_summary: str
    milestone_progress_estimate: str
    productivity_assessment: str
    critical_issues_flagged: List[str]
    action_items_for_tomorrow: List[str]
    compliance_rating: str

# ----------------- Weather Advisory Schemas -----------------
class WeatherAdvisoryRequest(BaseModel):
    location: str
    temperature_c: float
    precipitation_risk: str
    wind_speed_kmh: float
    humidity_pct: float
    planned_activities: List[str]

class ActivityAssessment(BaseModel):
    activity: str
    status: str = Field(description="Allowed, Caution, Restricted, Prohibited")
    reason: str
    safety_protocol: str

class WeatherAdvisoryResponse(BaseModel):
    overall_site_workability: str
    advisory_summary: str
    activity_assessments: List[ActivityAssessment]
    emergency_weather_measures: List[str]

# ----------------- Assistant Schemas -----------------
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatQuery(BaseModel):
    message: str
    topic: Optional[str] = "General Construction Intelligence"
    chat_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    suggested_followups: List[str]
    reference_codes: List[str]
