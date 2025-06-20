# Agentic AI-Based PoC Risk Mitigation Simulator

## Overview
A full-stack, AI-driven simulator to evaluate Proof of Concept (PoC) strategies using autonomous agents, external document ingestion, and a Retrieval-Augmented Generation (RAG) pipeline powered by vector databases (Chroma or FAISS).

## Architecture
- **Frontend:** React + Axios
- **Backend:** Node.js (Express) + MongoDB
- **Agent Layer:** Python (LangChain Agents + Tools + RAG)
- **Vector Store:** Chroma or FAISS

## Folder Structure
```
/agentic-poc-simulator
│
├── /frontend
│   ├── /public
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── /api
│   │   ├── /utils
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js or CRA config
│
├── /backend
│   ├── /node-api
│   │   ├── /routes
│   │   ├── /controllers
│   │   ├── /models
│   │   ├── /utils
│   │   │   └── agentRunner.js
│   │   ├── /middleware
│   │   ├── config.js
│   │   └── server.js
│   ├── /python-agents
│   │   ├── /agents
│   │   │   ├── tech_stack_agent.py
│   │   │   ├── integration_risk_agent.py
│   │   │   ├── budget_agent.py
│   │   │   ├── checklist_agent.py
│   │   │   └── lean_agent.py
│   │   ├── /tools
│   │   ├── /rag
│   │   │   ├── doc_ingestor.py
│   │   │   ├── web_scraper.py
│   │   │   ├── vector_store.py
│   │   │   └── retriever.py
│   │   ├── /data
│   │   │   ├── /raw
│   │   │   ├── /processed
│   │   │   └── /vector_store
│   │   ├── main_orchestrator.py
│   │   └── requirements.txt
│
├── /docs
│
├── .env
├── README.md
└── package.json (root if monorepo)
```

## Key Features
- Autonomous LangChain agents for PoC evaluation
- RAG pipeline for document ingestion and retrieval
- Orchestrated agent workflows via Node.js
- Modular, extensible architecture 


---

## 🔁 Data Flow & Execution Flow

### 📤 From User to Agents

1. **Frontend (Next.js)**
   - User submits PoC strategy: tech stack, external services, budget, timeline.
   - Axios sends POST request to backend API endpoint.

2. **Backend (Express.js)**
   - Accepts strategy submission.
   - Triggers `agentRunner.js`, which uses `child_process` to execute the Python orchestrator.

3. **Python Orchestrator**
   - **main_orchestrator.py** controls the flow across all agents:
     1. `TechStackAgent` → evaluates feasibility
     2. `IntegrationRiskAgent` → predicts integration risks
     3. `BudgetAgent` → simulates budget burn
     4. `ChecklistAgent` → generates pre-launch tasks
     5. `LeanAgent` → recommends leaner alternatives using RAG
   - Results are stored in MongoDB and sent back to the backend.

4. **Backend → Frontend**
   - Backend sends all agent responses as structured JSON.
   - Frontend renders dashboards: risk reports, checklists, lean roadmaps.

---

## 🧩 Agent Workflows (Python)

| Agent | Function |
|-------|----------|
| `tech_stack_agent.py` | Assesses compatibility, scalability, and risks in proposed tech stack. |
| `integration_risk_agent.py` | Predicts integration failure points (e.g., API limits, GDPR issues). |
| `budget_agent.py` | Simulates burn rate and timeline constraints. |
| `checklist_agent.py` | Creates a customized checklist for PoC validation and testing. |
| `lean_agent.py` | Uses RAG to suggest minimal viable alternatives from real-world case studies. |

---

## 🔍 RAG Pipeline

- **Ingests**: Startup case studies, engineering blogs, regulatory docs.
- **Processes**: Via `doc_ingestor.py` and stored in vector store (FAISS or Chroma).
- **Retrieves**: Contextual references dynamically used in `lean_agent.py`.

---

## ✅ Example Flow

```mermaid
graph TD;
    A[User submits PoC form (frontend)] --> B[POST to Express API];
    B --> C[Call Python orchestrator via child_process];
    C --> D1[Tech Stack Agent];
    D1 --> D2[Integration Agent];
    D2 --> D3[Budget Agent];
    D3 --> D4[Checklist Agent];
    D4 --> D5[Lean Agent (RAG)];
    D5 --> E[Send Results to Backend];
    E --> F[Send JSON response to Frontend];
    F --> G[Render Dashboard]
