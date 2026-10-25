from backend.models.schemas import ChatQuery, ChatResponse
from backend.services.gemini_service import gemini_service

ASSISTANT_SYSTEM_PROMPT = """
You are the AI Construction Knowledge Specialist on the Multimodal Construction Intelligence Platform.
You assist project managers, structural engineers, architects, quantity surveyors, and safety officers.
Provide concise, authoritative, technically accurate answers referencing international codes (OSHA, IBC, ACI, Eurocode, IS Codes).
Always maintain professional civil engineering terminology.
"""

KNOWLEDGE_BASE = {
    "curing": {
        "reply": "Standard concrete curing requires maintaining adequate moisture and temperature (>10°C) for a minimum of 7 days for Ordinary Portland Cement (OPC) and 14 days for blended pozzolanic cements (ACI 308R / IS 456). Proper curing achieves ~70% of design compressive strength and prevents early plastic shrinkage microcracks.",
        "followups": ["What curing methods are best in hot dry climates?", "How does membrane curing compare with wet burlap ponding?"],
        "codes": ["ACI 308R - Guide to External Curing of Concrete", "IS 456:2000 - Plain and Reinforced Concrete Code", "ASTM C309 - Liquid Membrane-Forming Compounds"]
    },
    "scaffolding": {
        "reply": "Per OSHA 29 CFR 1926.451, all scaffolding platforms 10 feet or higher must be equipped with guardrail systems (top rail 38-45 inches, midrail midway, and 3.5 inch toeboards). Scaffolds must support their own weight and at least 4 times the maximum intended load. Base plates and mudsills are required on bare ground.",
        "followups": ["What are the tie-in requirements for scaffolding towers?", "Who qualifies as an OSHA competent scaffolding person?"],
        "codes": ["OSHA 29 CFR 1926 Subpart L (Scaffolds)", "BS EN 12811 - Temporary Works Equipment"]
    },
    "slump": {
        "reply": "Concrete slump measures workability and consistency (ASTM C143). Standard structural columns/beams generally require 100-150mm slump (medium-high workability for congested rebar), while road pavements require 25-50mm (low slump). Excess water increases slump but drastically degrades compressive strength and durability via increased w/c ratio.",
        "followups": ["How do superplasticizers affect slump without altering water/cement ratio?", "What causes shear or collapse slump failures during testing?"],
        "codes": ["ASTM C143 / C143M - Standard Test Method for Slump of Hydraulic-Cement Concrete", "IS 1199 - Methods of Sampling and Analysis of Concrete"]
    }
}

async def answer_construction_query(query: ChatQuery) -> ChatResponse:
    user_msg = query.message.strip()
    history = [msg.model_dump() for msg in (query.chat_history or [])]

    if gemini_service.is_configured():
        prompt = f"{ASSISTANT_SYSTEM_PROMPT}\nTopic: {query.topic}\nQuestion: {user_msg}"
        text_res = await gemini_service.generate_text(prompt, chat_history=history)
        if text_res:
            return ChatResponse(
                reply=text_res,
                suggested_followups=[
                    f"What are the relevant code tolerances for {query.topic}?",
                    "What quality assurance testing verifies this on-site?",
                    "What are common contractor compliance pitfalls?"
                ],
                reference_codes=["IBC 2024 Chapter 17 (Special Inspections)", "ACI 318-19 Building Code Requirements", "OSHA 1926 Subpart C"]
            )

    # Heuristic domain response matching
    msg_lower = user_msg.lower()
    for key, data in KNOWLEDGE_BASE.items():
        if key in msg_lower:
            return ChatResponse(
                reply=data["reply"],
                suggested_followups=data["followups"],
                reference_codes=data["codes"]
            )

    return ChatResponse(
        reply=f"In response to your query regarding '{user_msg}': Across civil engineering and construction management, industry best practice mandates strict alignment with design specifications, documented inspection checkpoints, and ASTM/ACI material standards. Ensuring thorough pre-pour checklists, calibrated testing apparatus, and continuous safety barrier protocols will safeguard project quality and timeline milestones.",
        suggested_followups=[
            "What specific ASTM / ISO standards govern this activity?",
            "How can we integrate this into our daily site inspection checklist?",
            "What are the cost and schedule implications of non-compliance?"
        ],
        reference_codes=[
            "ACI 318 - Structural Concrete Building Code",
            "OSHA 29 CFR 1926 - Safety Regulations for Construction",
            "ASTM International Standards for Construction Materials"
        ]
    )
