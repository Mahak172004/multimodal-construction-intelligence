# AI-Powered Multimodal Construction Intelligence Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-TailwindCSS%203-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI%20Layer-Google%20Gemini%20Multimodal-4285F4.svg?logo=google-cloud&logoColor=white)](https://ai.google.dev/)
[![OSHA & ACI](https://img.shields.io/badge/Compliance-OSHA%201926%20%7C%20ACI%20224R-orange.svg)]()

> **Full-Stack Intelligent Decision-Support System for Modern Construction & Real Estate Engineering**  
> Developed as part of the *Generative AI with Google Cloud* program on SkillWallet.

---

## 📌 Project Overview

The **Multimodal Construction Intelligence Platform** is an enterprise-grade decision-support system engineered to assist construction professionals—project managers, structural engineers, safety officers, and quantity surveyors—across all phases of planning, execution, and field monitoring.

By combining **multimodal artificial intelligence** (visual reasoning on site imagery, drone captures, and structural elements) with **quantitative civil engineering models** and **strict JSON data contracts**, the platform automates hazard identification, defect classification, valuation estimation, CPM schedule planning, and weather-critical risk auditing.

---

## 🏗️ Technical Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React.js Web Application                        │
│         (Vite + Tailwind CSS + Lucide Icons + Interactive Dashboards)   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ JSON REST API / Multipart Form-Data
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Application Logic                       │
│    (Pydantic Schemas, CORS Middleware, Asynchronous Domain Services)   │
├────────────────────────────────────────────────────────────────────────┤
│  • Safety Vision Service        • Crack Forensic Diagnostic Service    │
│  • Quantity Surveying Valuation • WBS Scheduling & Critical Path CPM   │
│  • Daily Shift Briefing Service • Weather Risk Envelope Service        │
│  • Engineering Standards RAG Assistant Service                         │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Google Gemini Multimodal AI Layer                    │
│     (Vision Reasoning, Structured JSON Schema Generation, Codes RAG)   │
│       *Includes resilient civil engineering heuristic fallback engine  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Feature Modules

### 1. 🛡️ Construction Site Safety & PPE Vision Monitoring
- **Multimodal Visual Inspection:** Detects personnel, personal protective equipment (hard hats, hi-vis reflective vests, safety harnesses, steel-toe footwear, eye protection).
- **Hazard Identification:** Flags unprotected leading edges, missing guardrails, slip/trip cord runs, and excavator/crane swing radius intrusions.
- **Regulatory Compliance:** Automatically references relevant **OSHA 29 CFR 1926** sections with prioritized immediate action items.

### 2. 🔍 Crack Detection & Structural Defect Forensic Analysis
- **Defect Classification:** Distinguishes structural shear diagonal cracks, thermal plastic shrinkage, foundation settlement, spalling, and efflorescence.
- **Aperture & Depth Estimation:** Evaluates aperture width (mm) and structural penetration depth relative to rebar cover.
- **Engineering Remediation:** Recommends prioritized repair methods (e.g., ASTM C881 high-pressure epoxy injection, polyurethane grouting, carbon fiber CFRP wraps) with urgency tiers and monitoring schedules.

### 3. 📊 Real Estate Valuation & Quantity Surveying Cost Engine
- **Parametric Costing:** Calculates total civil construction cost, MEP allowances, finishes, and contingencies based on built-up area, quality tier, and floor count.
- **Stage-Aware Capitalization:** Computes current market asset value, projected ROI percentage, and residual **cost-to-complete**.
- **Market Intelligence:** Generates investment risk scores and actionable macroeconomic trend insights.

### 4. 📅 Construction Project Planning & Scheduling (WBS & CPM)
- **Work Breakdown Structure (WBS):** Sequences project phases (Pre-construction, Deep Foundations, Superstructure Framing, MEP Rough-in, Interior Finishes, Commissioning).
- **Critical Path Method (CPM):** Highlights zero-float activities critical to on-time project completion.
- **Resource & Risk Allocation:** Outlines trade craft labor quotas and proactive risk mitigation strategies.

### 5. 📋 Daily Site Operations & Superintendent AI Briefing
- **Shift Report Aggregation:** Converts daily superintendent logs (headcount, completed tasks, delivered materials, equipment runtime) into executive briefings.
- **Productivity & Compliance:** Automatically grades shift productivity and flags critical bottlenecks.

### 6. 🌤️ Weather-Aware Site Advisory & Safe Activity Envelope
- **Meteorological Risk Evaluation:** Assesses scheduled tasks against real-time wind speed (km/h), precipitation risk, ambient temperature (°C), and humidity (%).
- **Activity Go/No-Go:** Enforces ANSI/OSHA limits (e.g. crane boom shutdown in high winds, hot-weather concrete curing precautions, scaffolding slip restrictions).

### 7. 💬 Construction Knowledge Assistant & Engineering Copilot
- **Technical Q&A:** Authoritative AI assistant referencing **ACI 318, IBC 2024, ASTM C143, IS 456**, and **OSHA 1926**.
- **Interactive Suggestions:** Offers technical follow-up questions and standard code citations.

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+** (tested on Python 3.14)
- **Node.js 18+** & **npm 9+**
- *(Optional)* **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/)). The system runs out-of-the-box with built-in heuristic intelligence if no key is configured.

---

### Backend Setup (FastAPI)

1. Open a terminal and navigate to the project root:
   ```bash
   cd "gen ai"
   ```

2. Activate the Python virtual environment:
   - **Windows:**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     source venv/bin/activate
     ```

3. (Optional) Set your Gemini API key in `backend/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```

4. Launch the FastAPI server:
   ```bash
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *The interactive Swagger API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

---

### Frontend Setup (React + Vite)

1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd "gen ai/frontend"
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser at [http://localhost:5173](http://localhost:5173).*

---

## 📁 Repository Structure

```
gen ai/
├── backend/
│   ├── models/
│   │   └── schemas.py              # Strict Pydantic JSON contracts
│   ├── services/
│   │   ├── gemini_service.py       # Google Gemini Multimodal integration
│   │   ├── safety_service.py       # Site safety & PPE vision analyzer
│   │   ├── crack_service.py        # Crack detection & structural forensics
│   │   ├── valuation_service.py    # Quantity surveying & cost valuation
│   │   ├── planner_service.py      # Project schedule & CPM planning
│   │   ├── site_log_service.py     # Daily superintendent log briefing
│   │   ├── weather_service.py      # Weather hazard envelope evaluation
│   │   └── assistant_service.py    # Construction engineering codes copilot
│   ├── config.py                   # Application settings & CORS config
│   ├── main.py                     # FastAPI REST routes & entrypoint
│   ├── requirements.txt            # Python dependencies
│   └── .env.example                # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with platform status & navigation
│   │   │   ├── SafetyMonitor.jsx   # Multimodal site safety inspector
│   │   │   ├── CrackAnalysis.jsx   # Concrete crack forensic analyzer
│   │   │   ├── ValuationEngine.jsx # Real estate valuation & cost engine
│   │   │   ├── ProjectPlanner.jsx  # WBS & CPM schedule planner
│   │   │   ├── DailySiteLogs.jsx   # Field operations briefing
│   │   │   ├── WeatherAdvisory.jsx # Meteorological safety matrix
│   │   │   └── KnowledgeAssistant.jsx # Engineering standards chat copilot
│   │   ├── services/
│   │   │   └── api.js              # Full-stack API client
│   │   ├── App.jsx                 # Application state & layout
│   │   ├── main.jsx                # React DOM root
│   │   └── index.css               # Tailwind CSS directives
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🛡️ License

This project is created for educational and professional demonstration purposes under the **MIT License**.
