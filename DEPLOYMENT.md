# 🚀 PolicyGuard Complete Deployment Guide

This guide covers all methods to completely deploy **PolicyGuard** (FastAPI Backend + React/Vite Frontend + Self-Hosted RAG Vector Engine).

---

## 📋 Prerequisites Checklist

| Component | Recommendation | Notes |
| :--- | :--- | :--- |
| **Python** | 3.10 / 3.11 | Required for local backend execution |
| **Node.js** | 18+ / 20+ | Required for frontend build |
| **Docker** | 24.0+ (Optional) | For containerized multi-service deployment |
| **Render / Vercel** | Free Accounts | For zero-cost cloud deployment |

---

## 🌐 Method 1: Zero-Cost Cloud Deployment (Render + Vercel)

### Step 1: Deploy Backend to Render

1. Push your repository to **GitHub / GitLab**.
2. Log into **[Render Dashboard](https://dashboard.render.com)**.
3. Click **New +** ➔ **Web Service**.
4. Connect your GitHub repository.
5. Configure the web service with these parameters:
   - **Name**: `policyguard-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Add **Environment Variables** under the *Environment* tab:
   ```ini
   ENVIRONMENT=production
   USE_SQLITE=true
   JWT_SECRET=your-secure-random-jwt-secret-key
   GEMINI_API_KEY=your_optional_gemini_api_key
   ```
7. Click **Create Web Service**.
8. Once deployed, copy your backend URL (e.g., `https://policyguard-backend.onrender.com`).
9. Verify health check: `https://policyguard-backend.onrender.com/api/health` ➔ `{"status": "ok"}`.

---

### Step 2: Deploy Frontend to Vercel

1. Log into **[Vercel Dashboard](https://vercel.com)**.
2. Click **Add New...** ➔ **Project**.
3. Import your PolicyGuard repository.
4. Configure Framework Preset:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
5. Expand **Environment Variables**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://policyguard-backend.onrender.com` (Your Render Backend URL)
6. Click **Deploy**.
7. Vercel will build and assign your domain (e.g., `https://policyguard.vercel.app`).

---

## 🐳 Method 2: One-Command Docker Compose (VPS / AWS EC2 / Local)

Deploy the full stack locally or on any Linux server (AWS EC2, DigitalOcean droplet, Hetzner, GCP) with a single command.

### 1. Run with Docker Compose

```bash
# Clone repository
git clone https://github.com/your-username/POLICYGUARD.git
cd POLICYGUARD

# Launch entire stack in detached mode
docker-compose up --build -d
```

### 2. Verify Services

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Stop Services

```bash
docker-compose down
```

---

## 💻 Method 3: Direct Host Run (Development / Local Production)

### Step 1: Start Backend (FastAPI)

```bash
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Initialize database
python -c "from database import init_db; init_db()"

# Start server
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Start Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔑 Environment Variables Reference

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `production` or `development` | Runtime environment mode |
| `USE_SQLITE` | `true` | Uses local SQLite DB (`policyguard.db`). Set `false` if using PostgreSQL |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname` | Optional PostgreSQL connection string |
| `JWT_SECRET` | `long-random-string` | Secret key for JWT token generation |
| `GEMINI_API_KEY` | `AIzaSy...` | (Optional) Google Gemini key for LLM fallback |
| `VITE_API_BASE_URL` | `http://localhost:8000` or Backend URL | Frontend API endpoint URL |

---

## 🧪 Post-Deployment Verification

Execute end-to-end integration tests to verify the deployment:

```bash
cd backend
python test_all_scenarios.py
```

Expected output:
```text
=== Testing PolicyGuard End-to-End Compliance Scenarios ===
1. Login: OK
2. Standard Compliance Check: OK
3. High Risk Structuring Violation: OK
4. PII Tokenization Check: OK
5. Audit Log Chain Verification: OK
```
