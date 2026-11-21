# Jobcadence • Career Pivot Coach (PS 25)

> An intelligent, closed-loop career transition architect that bridges the gap between your current software engineering experience and high-demand roles like **Applied AI Engineer**.

Built for **Hackathon Problem Statement 25**.

---

## 🚀 Key Features

1. **AI Skill Gap Intake (`/intake`)**
   - Parses resume text or uploaded PDF resumes using server-side `pypdf`.
   - Analyzes target roles and job descriptions to extract missing technical competencies and compute baseline **Role Match %**.
   - Includes 1-click **"Load Sample Career Pivot"** (*React Developer → Applied AI Engineer*).

2. **Closed-Loop Transition Dashboard (`/dashboard`)**
   - Live metrics: **Role Match %**, **Target Readiness**, and **Active Streak**.
   - Interactive `<LearningCurve />` visualization displaying milestone progress across sprints.
   - Dynamic 4-Week Recalibrated Roadmap with concrete tasks and milestones.
   - **Roadmap Recalibrated Alert Banner** that triggers automatically whenever mock interview performance requires remedial adjustment.

3. **Scenario Mock Interview & 4-Dimension Rubric (`/verify-skills`)**
   - Pre-populated with missing skills identified in the gap analysis.
   - Server-side Gemini generation of scenario-based technical questions.
   - Rigorous grading across 4 dimensions: *Technical Accuracy*, *Practical Depth*, *Edge-Case Reasoning*, and *Communication Clarity*.
   - **Closed-Loop Recalibration Rule:**
     - **Score < 70%:** Automatically prepends a tailored remediation module to **Week 1** of your roadmap.
     - **Score ≥ 70%:** Awards **+5%** to Role Match and issues an AI-Verified Skill Badge.

4. **Portfolio Proof Projects (`/projects`)**
   - Hands-on, production-grade deliverables proving practical competence (e.g., Enterprise Hybrid RAG, Self-Correcting Code Agent).
   - Marking a project complete adds **+7%** to Match Score and awards a verified badge.

5. **Application Funnel Analytics (`/applications`)**
   - Compare callback velocity across targeted resume variants (e.g., *Applied AI Engineer* vs. *Full-Stack AI*).
   - Generates strategic insights highlighting optimal role positioning.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- **State Management:** Unified `CareerContext` synced to `localStorage` (`career_pivot_state`)
- **Backend:** FastAPI, Python 3.12, `google-genai` SDK (`gemini-2.5-flash`), Pydantic v2, `pypdf`, Uvicorn

---

## ⚙️ Quickstart

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env  # Add your GEMINI_API_KEY inside .env
uvicorn main:app --host 127.0.0.1 --port 8000 --reload