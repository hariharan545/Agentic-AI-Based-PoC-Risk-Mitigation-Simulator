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