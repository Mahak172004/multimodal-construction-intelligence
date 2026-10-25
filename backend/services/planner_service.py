from backend.models.schemas import ProjectPlanRequest, ProjectPlanResponse, PlanPhase, ResourceAllocation, RiskItem
from backend.services.gemini_service import gemini_service

PLANNER_PROMPT = """
You are a Master Construction Project Scheduler and Project Management Professional (PMP).
Create an optimized construction project schedule, work breakdown structure (WBS), and risk matrix for:
Project Title: {title}
Project Type: {project_type}
Total Area: {area} sq.ft
Total Budget: ${budget}
Target Duration: {duration} months
Site Location: {location}
Optimization Priority: {priority}

Return ONLY a JSON object matching this schema:
{{
  "project_title": "{title}",
  "project_summary": "<executive overview of schedule strategy>",
  "estimated_completion_weeks": <int total weeks>,
  "critical_path_items": ["<item 1>", "<item 2>"],
  "phases": [
    {{
      "phase_name": "<Phase Name>",
      "duration_weeks": <int>,
      "start_week": <int>,
      "end_week": <int>,
      "key_deliverables": ["<deliverable 1>"],
      "dependencies": ["<dependency or None>"],
      "budget_allocation_pct": <float>
    }}
  ],
  "resource_allocations": [
    {{
      "role": "<Role, e.g. Rebar Ironworkers, Structural Engineers>",
      "count": <int count>,
      "peak_phase": "<Phase name>"
    }}
  ],
  "risk_mitigation_plan": [
    {{
      "risk": "<Identified risk>",
      "likelihood": "<Low | Medium | High>",
      "impact": "<Low | Medium | High>",
      "mitigation": "<Actionable mitigation strategy>"
    }}
  ]
}}
"""

async def generate_project_plan(req: ProjectPlanRequest) -> ProjectPlanResponse:
    prompt = PLANNER_PROMPT.format(
        title=req.project_title,
        project_type=req.project_type,
        area=req.total_area_sqft,
        budget=req.budget,
        duration=req.target_duration_months,
        location=req.location,
        priority=req.priority
    )

    if gemini_service.is_configured():
        gemini_data = await gemini_service.generate_json(prompt)
        if gemini_data:
            try:
                return ProjectPlanResponse(**gemini_data)
            except Exception:
                pass

    # Heuristic fallback project plan
    total_weeks = req.target_duration_months * 4
    return ProjectPlanResponse(
        project_title=req.project_title,
        project_summary=f"Optimized schedule for {req.project_type} ({req.total_area_sqft:,.0f} sq.ft) with priority placed on {req.priority}. WBS phased sequentially with fast-tracking opportunities between structural erection and interior MEP rough-ins.",
        estimated_completion_weeks=total_weeks,
        critical_path_items=[
            "Geotechnical site excavation & deep pile foundation approval",
            "Cast-in-place concrete structural core & column curing cycles",
            "Exterior building envelope / curtain-wall watertightness signoff",
            "HVAC ductwork and primary electrical substation commissioning"
        ],
        phases=[
            PlanPhase(
                phase_name="Phase 1: Pre-Construction & Permitting",
                duration_weeks=max(4, int(total_weeks * 0.12)),
                start_week=1,
                end_week=max(4, int(total_weeks * 0.12)),
                key_deliverables=[
                    "Zoning and architectural permit signoffs",
                    "Geotechnical bore-hole soil analysis",
                    "Subcontractor procurement and contract execution"
                ],
                dependencies=["Notice to Proceed"],
                budget_allocation_pct=8.0
            ),
            PlanPhase(
                phase_name="Phase 2: Substructure & Deep Foundations",
                duration_weeks=max(6, int(total_weeks * 0.18)),
                start_week=max(5, int(total_weeks * 0.12) + 1),
                end_week=int(total_weeks * 0.30),
                key_deliverables=[
                    "Site grading and retention shoring",
                    "Driven piles and reinforced raft slab casting",
                    "Underground stormwater and utility tie-ins"
                ],
                dependencies=["Phase 1: Pre-Construction & Permitting"],
                budget_allocation_pct=18.0
            ),
            PlanPhase(
                phase_name="Phase 3: Superstructure & Framing",
                duration_weeks=max(8, int(total_weeks * 0.32)),
                start_week=int(total_weeks * 0.30) + 1,
                end_week=int(total_weeks * 0.62),
                key_deliverables=[
                    "Post-tensioned elevated floor slabs",
                    "Structural steel column erection and decking",
                    "Cores, shear walls, and stair towers"
                ],
                dependencies=["Phase 2: Substructure & Deep Foundations"],
                budget_allocation_pct=34.0
            ),
            PlanPhase(
                phase_name="Phase 4: MEP Rough-in & Building Envelope",
                duration_weeks=max(6, int(total_weeks * 0.22)),
                start_week=int(total_weeks * 0.50),  # Fast-tracked overlap
                end_week=int(total_weeks * 0.78),
                key_deliverables=[
                    "Façade glazing and weatherproofing enclosure",
                    "Fire suppression sprinkler lines and riser drops",
                    "Electrical wiring conduits and main distribution boards"
                ],
                dependencies=["Phase 3: Superstructure (partial slab handover)"],
                budget_allocation_pct=22.0
            ),
            PlanPhase(
                phase_name="Phase 5: Architectural Finishes & Commissioning",
                duration_weeks=max(5, int(total_weeks * 0.16)),
                start_week=int(total_weeks * 0.78) + 1,
                end_week=total_weeks,
                key_deliverables=[
                    "Drywall partitioning, flooring, and ceiling tiles",
                    "MEP integrated testing and life-safety balancing",
                    "Final municipal occupancy certificate inspection"
                ],
                dependencies=["Phase 4: MEP Rough-in & Building Envelope"],
                budget_allocation_pct=18.0
            )
        ],
        resource_allocations=[
            ResourceAllocation(role="Structural & Civil Ironworkers", count=28, peak_phase="Phase 3: Superstructure & Framing"),
            ResourceAllocation(role="Licensed MEP Technicians & Electricians", count=22, peak_phase="Phase 4: MEP Rough-in"),
            ResourceAllocation(role="Concrete Finishers & Formwork Carpenters", count=20, peak_phase="Phase 2 & 3"),
            ResourceAllocation(role="Tower Crane & Heavy Equipment Operators", count=6, peak_phase="Phase 2 & 3"),
            ResourceAllocation(role="Site QA/QC & Safety Officers", count=4, peak_phase="All Phases")
        ],
        risk_mitigation_plan=[
            RiskItem(
                risk="Monsoon / Heavy Precipitation delays foundation pour",
                likelihood="Medium",
                impact="High",
                mitigation="Stage dewatering pumps and deploy rapid-curing concrete admixtures with waterproof tarps."
            ),
            RiskItem(
                risk="Supply chain latency for specialized switchgear and curtain wall units",
                likelihood="High",
                impact="High",
                mitigation="Issue early purchase orders with 16-week lead buffer and pre-approve equivalent domestic manufacturers."
            ),
            RiskItem(
                risk="Skilled trade labor shortage during peak framing",
                likelihood="Medium",
                impact="Medium",
                mitigation="Partner with two tier-1 labor sub-contractors with guaranteed standby quotas."
            )
        ]
    )
