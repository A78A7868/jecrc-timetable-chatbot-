# AI-Based ChatBot System with NLP and Automated Query Resolution

> Intelligent Orchestration Framework for Automated Academic Scheduling and Multi-Section Data Retrieval using LLM-Powered Agents

## Overview

An NLP-powered chatbot for JECRC University that interprets natural language student queries and retrieves real-time timetable data from complex multi-tabbed Google Sheets. Built with n8n workflow automation, Gemini 1.5 Flash LLM, and Google Sheets API v4.

## Architecture

```
Student Query (WhatsApp / Web Chat)
        │
        ▼
  ┌─────────────┐
  │  n8n Webhook │  ◄── Entry Point
  └──────┬──────┘
         │
         ▼
  ┌──────────────────┐
  │ Query Preprocessor│  ◄── Intent Extraction, Section ID, Day/Time
  └──────┬───────────┘
         │
         ▼
  ┌──────────────────────┐
  │ Gemini 1.5 Flash LLM │  ◄── Deterministic Section Mapping + NLP
  │   (AI Agent Node)    │
  └──────┬───────────────┘
         │
         ▼
  ┌─────────────────────┐
  │ Google Sheets API v4 │  ◄── Real-time Data Retrieval (OAuth 2.0)
  └──────┬──────────────┘
         │
         ▼
  ┌───────────────────┐
  │ Response Formatter │  ◄── Clean, Readable Output
  └──────┬────────────┘
         │
         ▼
  Student Receives Timetable Response
```

## Tech Stack

| Component           | Technology                          |
|---------------------|-------------------------------------|
| LLM                 | Gemini 1.5 Flash (Google AI Studio) |
| Orchestration       | n8n (self-hosted)                   |
| Data Source          | Google Sheets API v4                |
| Auth                | OAuth 2.0 (Google Cloud Console)    |
| Deployment          | Docker + WSL2                       |
| Chat Interface      | Web (Webhook) + WhatsApp API        |
| Version Control     | Git + GitHub                        |

## Project Structure

```
jecrc-timetable-chatbot/
├── docker/
│   ├── docker-compose.yml       # n8n + system containers
│   └── .env.example             # Environment variable template
├── frontend/
│   ├── index.html               # Chat interface
│   ├── css/style.css            # Chat styling
│   └── js/chat.js               # Webhook communication logic
├── n8n-workflows/
│   ├── main-chatbot-workflow.json    # Primary orchestration workflow
│   └── system-prompt.md              # Gemini agent system prompt
├── scripts/
│   ├── setup.sh                 # Initial setup script
│   └── health-check.sh          # System health verification
├── docs/
│   ├── diagrams/                # UML, DFD, architecture diagrams
│   └── screenshots/             # System output screenshots
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

## Quick Start

### Prerequisites

- Docker Desktop with WSL2 enabled
- Google Cloud Console project with Sheets API enabled
- OAuth 2.0 credentials (service account or desktop app)
- Gemini API key from Google AI Studio
- Node.js 18+ (for local frontend dev, optional)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/A78A7868/jecrc-timetable-chatbot.git
cd jecrc-timetable-chatbot

# 2. Copy environment template
cp .env.example .env
# Edit .env with your API keys and credentials

# 3. Start n8n with Docker
cd docker
docker-compose up -d

# 4. Import the workflow
# Open n8n at http://localhost:5678
# Import n8n-workflows/main-chatbot-workflow.json

# 5. Open frontend
# Open frontend/index.html in browser
```

## Supported Sections

| Abbreviation      | Full Name                | Sheet Tab           |
|-------------------|--------------------------|---------------------|
| SD                | Software Development     | CSE_SD_Sec_A        |
| AI / AIML         | AI & Machine Learning    | CSE_AIML_Sec_A      |
| CYS               | Cyber Security           | CSE_CyberSec_Sec_A  |
| IBM               | IBM Specialization       | CSE_IBM_Sec_A       |
| Xebia             | Xebia Specialization     | CSE_Xebia_Sec_A     |

## Sample Queries

- "What class do I have on Monday at 9 AM for SD section?"
- "Show me the Tuesday schedule for AI section"
- "Is there a lab on Wednesday for Cyber Security?"
- "What's my free period on Thursday? I'm in IBM section"

## Performance

| Metric                    | Result     |
|---------------------------|------------|
| NLP Accuracy              | 96%        |
| Avg Response Time         | 2.3s       |
| Peak Response (5 concurrent) | 2.8s    |
| Timetable Data Accuracy   | 100%       |

## Team

- **Varishtha Joshi** (23BCON0383)
- **Anand Krishna GR Nair** (23BCON1613)
- **Amit Jiji Varghese** (23BCON0202)

**Supervisor:** Mr. Ratish Kumar, Assistant Professor – II, Dept. of CSE, JECRC University

## License

This project is developed as part of the B.Tech Minor Project (VI Semester) at JECRC University, Jaipur. All rights reserved.
