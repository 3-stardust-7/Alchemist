# 🔶 The Alchemist - Autonomous Content Factory

---

## 🔸The Problem

Marketing teams waste hours manually rewriting the same content for every platform. A blog post becomes a LinkedIn thread becomes a newsletter, each written from scratch, each introducing new inconsistencies in tone and fact. This bottleneck slows product launches and burns out creative teams. There is no reliable, automated way to go from a single source document to accurate, platform-ready content across multiple channels simultaneously.

---

## 🔸The Solution

The Alchemist is a two-agent AI pipeline that takes a single raw source document and automatically produces three distinct pieces of platform-specific content. A blog post, a social media thread, and an email teaser, all grounded in a verified fact-sheet. Every run is persisted to a database and accessible from a collapsible history sidebar - so past transmutations are never lost.

**How it works:**

- **Agent I - Fact-Check Agent (The Analytical Brain):** Reads the raw source material and extracts a structured, verified Fact-Sheet covering core features, technical specs, target audience, key value proposition, and flags any ambiguous claims.
- **Agent II - Copywriter Agent (The Voice):** Takes the Fact-Sheet as its single source of truth and generates all three content formats simultaneously. Professional blog (~500 words), punchy social thread (5 posts), and a polished email teaser without inventing anything not in the Fact-Sheet.
- **History Sidebar:** Every completed run is saved to a Postgres database. A collapsible left sidebar lists all past runs grouped by date. Clicking any entry restores the full fact-sheet and content output instantly.

The frontend provides a clean interface where users paste raw material, watch the pipeline run, and receive all outputs formatted and ready to copy or download - with full run history persisted across sessions.

---

## 🔸Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Language** | JavaScript, HTML, CSS |
| **Frontend Framework** | React 18 (Vite) |
| **State Management** | Redux Toolkit |
| **Styling** | CSS-in-JS, Tailwind utility classes |
| **Backend Language** | Python |
| **Backend Framework** | FastAPI |
| **AI Orchestration** | LangGraph, LangChain |
| **LLM** | Google Gemini 2.5 Flash Lite via `langchain-google-genai` |
| **AI API** | Google Gemini API (`GEMINI_API_KEY`) |
| **Database** | PostgreSQL (via SQLAlchemy ORM) |
| **DB Hosting** | Render Postgres |
| **Frontend Hosting** | GitHub Pages |
| **Backend Hosting** | Render |

---

## 🔸Setup Instructions

### 🌐 Live Demo

The project is fully deployed and ready to use:

| | URL |
|---|---|
| **Frontend** | [https://3-stardust-7.github.io/Alchemist/](https://3-stardust-7.github.io/Alchemist/) |
| **Backend API** | [https://alchemist-fnis.onrender.com/](https://alchemist-fnis.onrender.com/) |

Just open the frontend URL, paste your source material, and hit **Begin Transmutation**. No setup required. Past runs are saved automatically and accessible from the history sidebar.

---

### 💻 Run Locally

#### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (running locally)
- A Google Gemini API key → [Get one free at aistudio.google.com](https://aistudio.google.com)

---

#### 1. Clone the repository

```bash
git clone https://github.com/3-stardust-7/Alchemist.git
cd Alchemist
```

---

#### 2. Create the local database

```bash
# In psql or via your Postgres client
createdb alchemist
```

---

#### 3. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/alchemist
```

Start the backend:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be running at `http://localhost:8000`

---

#### 4. Frontend setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

---

#### 5. Connect frontend to local backend

Make sure `frontend/.env` (or your Vite env config) points to the local backend:

```env
VITE_API_URL=http://localhost:8000
```

*(The deployed version points to the Render backend URL - swap this for local development.)*

---

## 🔸API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/process-document` | Run the two-agent pipeline; saves result to DB |
| `GET` | `/api/history` | List all past runs (most recent first, limit 50) |
| `GET` | `/api/history/{id}` | Fetch full results for a specific run by ID |

---

## 🔸Screenshots

### 1. Processing - Source Material Processing
<img width="1920" height="1080" alt="Screenshot From 2026-04-07 14-39-12" src="https://github.com/user-attachments/assets/571e8072-0954-4107-9da1-beb3219301ea" />

### 2. Output - Source Material Processed
<img width="1913" height="1006" alt="Screenshot From 2026-04-07 16-08-43" src="https://github.com/user-attachments/assets/2caa9049-d037-44c8-81f9-5a552aeba482" />

### 3. Results - Verified Fact-Sheet (Agent I Output)
<img width="1913" height="1006" alt="Screenshot From 2026-04-07 16-10-15" src="https://github.com/user-attachments/assets/bf7f05c0-69be-4324-a14e-1139d4dfdc4f" />

### 4. Results - Tabbed Content Output (Blog)
<img width="1913" height="1006" alt="Screenshot From 2026-04-07 16-09-59" src="https://github.com/user-attachments/assets/dfff0bc8-3a80-4c16-87a9-0c9c7dc4a2ce" />

### 5. Results - Tabbed Content Output (Social)
<img width="1913" height="1006" alt="Screenshot From 2026-04-07 16-09-32" src="https://github.com/user-attachments/assets/018e083f-0adc-43fa-9c6a-5674e78438f1" />

### 6. Results - Tabbed Content Output (Email)
<img width="1913" height="1006" alt="Screenshot From 2026-04-07 16-09-22" src="https://github.com/user-attachments/assets/4338781f-1de5-43f5-8179-f85ef183bfbb" />

---

## 🔸Project Structure

```
ALCHEMIST/
├── backend/
│   ├── __pycache__/
│   ├── venv/
│   ├── .env
│   ├── main.py             # FastAPI app + LangGraph pipeline
│   ├── database.py         # SQLAlchemy engine & session setup
│   ├── models.py           # Campaign ORM model
│   ├── schemas.py          # Pydantic request/response schemas
│   └── requirements.txt

├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── display/
│   │   │   ├── icons/
│   │   │   └── ui/
│   │   │       └── HistorySidebar.jsx   # Collapsible history sidebar
│   │   ├── pages/
│   │   │   └── Home.jsx                 # Landing page
│   │   ├── store/
│   │   │   ├── CampaignSlice.js         # Submission state
│   │   │   ├── HistorySlice.js          # History fetch state
│   │   │   └── Store.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── sidebar.css                  # Sidebar styles
│   │   ├── index.css
│   │   └── main.jsx

│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js

├── .gitignore
└── README.md
```

---

*Built for the Autonomous Content Factory challenge - Marketing Tech Track.*
