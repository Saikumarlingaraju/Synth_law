# ⚡ Synth-Law Quick Start (5 Minutes)

## 🎯 Get Running in 5 Steps

### Step 1: Get Google API Key (2 min)
```bash
# Visit: https://aistudio.google.com/app/apikey
# Click "Create API Key"
# Copy the key (looks like: AIzaSyXXXXXXXXXXXXXXXXX)
```

### Step 2: Configure (1 min)
```bash
cd c:\Users\manvi\OneDrive\Desktop\synthlaw

# Copy example env file
cp .env.example .env

# Edit .env and paste your API key
# GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX
```

### Step 3: Install (1 min)
```bash
npm install
```

### Step 4: Run (1 min)
```bash
npm run dev
```

**You should see:**
```
✅ RAG engine initialized with Gemini 1.5 Pro

VITE v5.1.0  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Backend: http://localhost:4000/
```

### Step 5: Test (optional)
- Open http://localhost:5173
- Click "Analyze Your Contract"
- Upload a PDF (can be any contract)
- Click "Analyze Contract"
- View results in 3 tabs: DETECT | DECIPHER | DEFEND

---

## 📁 Key Files (For Reference)

| File | Purpose |
|------|---------|
| `src/ai/rag-engine.ts` | RAG with Gemini 1.5 Pro |
| `src/ai/analyzer.ts` | 7 risk pattern detector |
| `src/ai/index.ts` | Express API server |
| `src/components/AnalysisResults.tsx` | Results UI |
| `.env.example` | Environment config template |
| `RAG_IMPLEMENTATION.md` | Detailed technical docs |
| `SETUP.md` | Full setup guide |

---

## 🚀 Deployment (When Ready)

### Build for Production
```bash
npm run build
# Creates: dist/ folder (177KB gzipped)
```

### Test Production Build Locally
```bash
npm run preview
# Opens: http://localhost:4173
```

### Deploy Frontend (Vercel/Netlify)
```bash
# Push dist/ folder to your hosting
# Frontend will work without changes
```

### Deploy Backend
```bash
# Copy src/ai/ to server
# Set GOOGLE_API_KEY environment variable
# Run: npm run dev:server
# Or: npm run build:server && node dist/server.js
```

---

## 💡 Key Features

✅ **DETECT**: Find 7 risky clauses  
✅ **DECIPHER**: Translate to plain English + Hindi + Telugu  
✅ **DEFEND**: Generate negotiation emails grounded in Indian law  
✅ **RAG Powered**: Uses Gemini 1.5 Pro for legal grounding  
✅ **Works Offline**: Fallback to heuristics if no API key  
✅ **Secure**: PII masking, no storage  
✅ **Fast**: < 10 seconds per analysis  

---

## ❓ Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules
npm install
npm run dev
```

### "GOOGLE_API_KEY not found"
```bash
# Check .env file exists in project root
# Check it has: GOOGLE_API_KEY=your_actual_key
# Restart: npm run dev
```

### "Port 4000 already in use"
```bash
# Either:
# 1. Kill the process on port 4000
# 2. Change port in .env: API_PORT=4001
```

### Build fails
```bash
npm run build 2>&1 | grep error
# Copy error message to GitHub issue
```

---

## 📚 Documentation

- **RAG_IMPLEMENTATION.md** → Technical deep dive
- **SETUP.md** → Complete setup & usage guide  
- **README.md** → Project overview

---

## 🎉 You're Ready!

Your Synth-Law instance is running. Now you can:

1. **Test** with your own contracts
2. **Share** the URL (localhost:5173) with freelancers
3. **Collect** feedback on risk detection accuracy
4. **Plan** next features (Gmail, Calendar, more languages)

---

## 📞 Need Help?

- **GitHub**: Create an issue
- **Email**: support@synthlaw.ai
- **Docs**: See RAG_IMPLEMENTATION.md

---

**Synth-Law: Protecting Indian Freelancers with AI** ⚖️
