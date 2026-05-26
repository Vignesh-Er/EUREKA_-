# ⬢ Project Eureka: Technical & Career Intelligence Monorepo

[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA%20NIM-qwen3.5--122b-green?style=flat-square&logo=nvidia)](https://build.nvidia.com/)
[![Framework](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Vector Search](https://img.shields.io/badge/Vector%20Store-Qdrant-red?style=flat-square&logo=qdrant)](https://qdrant.tech/)

> "An AI-powered academic and career intelligence platform built to eliminate the 'context vacuum' in technical education by connecting theoretical concepts directly to campus labs, real-world industry products, and targeted placement pathways."

---

## 📖 1. The Inspiration: Ending the "Context Vacuum"

In traditional engineering education, students routinely study abstract, high-level mathematical and physical theorems without understanding their real-world relevance. 

For instance, they memorize the **Fourier Transform**:

$$ X(f) = \int_{-\infty}^{\infty} x(t) e^{-j 2 \pi f t} dt $$

Or derive continuous-time state-space models for control engineering:

$$ \dot{x}(t) = Ax(t) + Bu(t) $$

$$ y(t) = Cx(t) + Du(t) $$

Without ever knowing that:
1. **Fourier Transforms** act as the mathematical heart of signal modulation inside **Qualcomm Snapdragon modems** in their smartphones.
2. **State-Space Representations** are implemented in C++ to guide path planning inside **Tesla Autonomous Vehicles**.
3. A specific **Campus Laboratory** contains the exact DSP/control boards where these can be measured physically.
4. Top companies are actively recruiting for roles requiring these exact competencies.

**Project Eureka** closes this loop. By constructing a persistent **Student Digital Twin** and leveraging the **NVIDIA NIM `qwen/qwen3.5-122b-a10b`** model, the platform provides a continuous academic companion guiding students from orientation to job placement.

---

## 🌌 2. Core 8-Engine Architecture

Project Eureka operates as a unified educational ecosystem powered by eight interconnected AI engines:

```
                  ┌──────────────────────────────┐
                  │   Student Lab Exploration    │
                  └──────────────┬───────────────┘
                                 ▼
                     ╔══════════════════════╗
                     ║  1. Discovery Engine ║ ──► Suggests Specializations
                     ╚══════════════════════╝
                                 ▼
                     ╔══════════════════════╗
                     ║ 3. Journey Engine    ║ ──► Generates Academic Roadmaps
                     ╚══════════════════════╝
                                 ▼
                     ╔══════════════════════╗
                     ║  2. Context Engine   ║ ──► Link Syllabus to Industry Cards
                     ╚══════════════════════╝
                                 ▼
┌────────────────────────────────┴────────────────────────────────┐
│                      DAILY LEARNING LOOP                        │
│                                                                 │
│   Professor Uploads slides/text                                 │
│                  │                                              │
│                  ▼                                              │
│       ╔══════════════════════╗                                  │
│       ║ 5. Companion Engine  ║ ──► Simplified summaries & labs  │
│       ╚══════════════════════╝                                  │
│                  │                                              │
│        ┌─────────┴─────────┐                                    │
│        ▼                   ▼                                    │
│  ╔═════════════════╗ ╔═════════════════╗                        │
│  ║ 4. Eval Engine  ║ ║ 7. Trans Engine ║                        │
│  ║ (Assessments)   ║ ║ (NLLB-200)      ║                        │
│  ╚═════════════════╝ ╚═════════════════╝                        │
│        │                                                        │
│        ▼ (Gap analysis)                                         │
│   Updates Journey Engine                                        │
└────────────────────────────────┬────────────────────────────────┘
                                 ▼
                     ╔══════════════════════╗
                     ║  6. Admin Engine     ║ ──► Procurements, Absences, Feedback
                     ╚══════════════════════╝
                                 ▼
                     ╔══════════════════════╗
                     ║  8. Placement Engine ║ ──► Dynamic Job Match & AI Tutor
                     ╚══════════════════════╝
```

---

## ⚡ 3. Key Active AI Capabilities (NVIDIA NIM qwen/qwen3.5-122b-a10b Powered)

### 🎓 Autonomous Bloom's Taxonomy OBE Accreditation Engine
* **The Problem**: Accreditation boards (such as NBA and NAAC) require professors to map examination questions to specific Course Outcomes (COs) and balance cognitive difficulty. This requires hundreds of manual hours.
* **The Solution**: The upgraded Accreditation engine accepts examination text inputs. It analyzes each question, maps it toregistered COs, rates the difficulty, and assigns a **Bloom's Cognitive Taxonomy Level** ($L_1$ Remembering through $L_6$ Creating). It flags high rote-memorization levels and produces dynamic compliance sheets.

### 💼 Career Matcher & RAG Skill-Gap Placement Sandbox
* **The Problem**: Job readiness indicators are usually static percentages, providing zero direction on how to close skill deficits.
* **The Solution**: The upgraded Placement engine loads the student's persistent **Digital Twin** profile (storing GPAs, project histories, platform XP). It runs comparative matching against top job descriptions, calculates corporate match ratings, and formulates a **Customized 3-Day Action Plan**. 
* **AI Skill Sandbox**: Students can select any gap (e.g. `CUDA Programming`) to activate a live, interactive mock-interview tutor that delivers coding challenges and evaluates outputs.

---

## 🛠️ 4. Technology Stack

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, Recharts.
* **Backend**: FastAPI (Python 3.12), Pydantic, SQLAlchemy.
* **Databases & Cache**: PostgreSQL (relational profiles), Qdrant Cloud (vector similarity search), Redis (caching and rate-limiting).
* **AI Services**:
  * **NVIDIA NIM API** (accessing `qwen/qwen3.5-122b-a10b` for reasoning, matching, and OBE audits).
  * **NLLB-200** (Distilled-600M self-hosted translation engine).

---

## 🚀 5. Quick Start Guide

### Prerequisites
* Node.js v18+
* Python 3.11+
* Active NVIDIA NIM API Key (already pre-loaded inside `backend/.env` for testing!)

---

### Step 1: Run the FastAPI Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Initialize and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Launch the Uvicorn server:
   ```bash
   python main.py
   ```
   *The Swagger API documentation will be available instantly at `http://localhost:8000/docs`.*

---

### Step 2: Run the Next.js Frontend App
1. Open a new terminal and navigate to the NextJS folder:
   ```bash
   cd b_vNy9IRZa6ez-1774112432284
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *Access the web dashboard in your browser at `http://localhost:3000`.*

---

## 🌐 6. Vercel Monorepo Deployment

When deploying this project to **Vercel**, you may encounter a build failure saying `No Next.js version detected` if Vercel attempts to build from the repository root.

To deploy successfully:
1. Connect your GitHub repository to your Vercel Account.
2. In the **Project Settings** dashboard, go to the **General** tab.
3. Locate the **Root Directory** setting and set it to:
   ```text
   b_vNy9IRZa6ez-1774112432284
   ```
4. Save settings and trigger a redeploy! Vercel will automatically cd into the Next.js directory, build, and deploy your frontend beautifully.

---

## 📓 7. Dev Log & Diary
All architectural coordinates, implemented routes, and chronological logs are recorded in our developer's log book:
* Review logs in: **[memory_bank.md](file:///e:/Eureka/memory_bank.md)**

