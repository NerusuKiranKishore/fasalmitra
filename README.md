# 🌾 FasalMitra — AI Farming Companion for Andhra Pradesh

AI-powered farming assistant for small & marginal farmers in Andhra Pradesh.
Features: Crop Advisory · Weather Tips · Mandi Prices · Government Schemes
---
🌐 **Live Demo:** [https://fasalmitra-three.vercel.app](https://fasalmitra-three.vercel.app)
**Demo Video:** https://youtu.be/yYQM0aOocZM  
## 🤖 AI Reasoning Agent

FasalMitra uses multi-step AI reasoning (Google Gemini 2.0 Flash) to provide intelligent crop advisory for Andhra Pradesh farmers. The agent analyzes:
- 🔍 District climate patterns
- 🌱 Soil type compatibility
- 📅 Seasonal crop suitability
- 📊 Land size optimization
- 💡 Profitability & sustainability

## 🎯 Features
- AI-powered crop recommendations with multi-step reasoning
- Real-time weather forecasts with farming tips
- Live mandi (wholesale market) prices
- Government farmer schemes & eligibility info
- Telugu language support

## 🛠️ Built With
- **Frontend:** React (Vercel)
- **Backend:** FastAPI (Render)
- **AI:** Google Gemini 2.0 Flash
- **APIs:** Open-Meteo, data.gov.in

---

## 🚀 Quick Start (VS Code Terminal)

### Step 1 — Clone & open
```bash
cd FasalMitra
```

### Step 2 — Backend Setup
```bash
cd backend
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt

# Create your .env file
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux

# Edit .env and add your Gemini API key
# Get free key at: https://aistudio.google.com/app/apikey

python main.py
# Backend runs at http://localhost:8000
```

### Step 3 — Frontend Setup (open a new terminal)
```bash
cd frontend
npm install
npm start
# Frontend runs at http://localhost:3000
```

---

## 🔑 Getting Your Free Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into `backend/.env`

---

## 📁 Project Structure

```
FasalMitra/
├── backend/
│   ├── main.py              ← FastAPI app (all routes)
│   ├── schemes.json         ← Government schemes data
│   ├── requirements.txt
│   ├── .env.example
│   └── render.yaml          ← Render deployment config
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           ← Router
│   │   ├── index.js
│   │   ├── index.css        ← All styles
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── CropAdvisory.js
│   │   │   ├── Weather.js
│   │   │   ├── Mandi.js
│   │   │   └── Schemes.js
│   │   └── utils/
│   │       └── api.js       ← All API calls
│   ├── package.json
│   └── vercel.json          ← Vercel config
└── .gitignore
```

---

## 🌐 Deployment

### Backend → Render (Free)
1. Push to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Set Root Directory: `backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add Environment Variable: `GEMINI_API_KEY = your_key`
8. Deploy → copy the URL (e.g. `https://fasalmitra-api.onrender.com`)

### Frontend → Vercel (Free)
1. Go to https://vercel.com → New Project
2. Connect your GitHub repo
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render backend URL
5. Deploy!

---

## 🛠️ APIs Used (All Free)
| Feature | API |
|---|---|
| AI Crop Advisory | Google Gemini 2.0 Flash |
| Weather | Open-Meteo (no key needed) |
| Mandi Prices | data.gov.in |
| Schemes | Local JSON |

---

## 📸 Features
- 🌱 **AI Crop Advisory** — Soil + Season + District → Best crops to grow
- 🌤️ **Weather** — 7-day forecast + AI irrigation & pest tips
- 📊 **Mandi Prices** — Live prices from AP mandis
- 📋 **Govt Schemes** — 8+ schemes with eligibility & apply links
