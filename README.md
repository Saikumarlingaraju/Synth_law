# Synth-Law 🏛️

**"Leveling the Legal Playing Field"**

The World's First Agentic Legal Assistant for the 15 Million Indian Freelancers.

## 🎯 What is Synth-Law?

Synth-Law is an AI-powered legal assistant that helps Indian freelancers:
- **DETECT** risky contract clauses with visual risk heatmaps
- **DECIPHER** legal jargon into plain language (+ Hindi, Telugu translations)
- **DEFEND** automatically by drafting professional negotiation emails

## 🚀 Quick Start

### Prerequisites
- Node.js 18+

### Installation

1. **Install dependencies**
   ```bash
   cd synthlaw
   npm install
   ```

2. **Start the app**
   ```bash
   npm run dev
   ```

   - UI: `http://localhost:5173`
   - API: `http://localhost:4000`

3. *(Optional)* configure a different API base in `.env`
   ```env
   VITE_API_URL=http://localhost:4000
   ```

## 📖 How to Use

1. **Upload a contract** (PDF, Word, or Image)
2. **Click "Analyze Contract"** - AI will process it
3. **View Results** in three tabs:
   - 🛡️ **DETECT**: See all risky clauses with legal citations
   - 🌐 **DECIPHER**: Plain language + regional translations
   - ✉️ **DEFEND**: AI-drafted negotiation email

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind-styled design
- **Backend**: Express + TypeScript heuristics engine
- **Document Processing**: pdf-parse, mammoth, tesseract.js
- **Translations & Negotiation**: Rule-based summaries with Hindi/Telugu coverage

## 📊 The Problem We're Solving

- **72%** of freelancers sign contracts they don't understand
- **9.2%** annual revenue lost to unfavorable terms
- **₹15,000** average cost for simple contract review

## ✨ Features

### Core Features
- ✅ Multimodal input (PDF, Word, Images with OCR)
- ✅ Risk heatmap scoring (Red/Orange/Green)
- ✅ Red-flag detection (IP, liability, payment terms)
- ✅ Plain-English translation
- ✅ Multilingual support (Hindi, Telugu)
- ✅ Agentic negotiation email drafting
- ✅ Legal grounding with RAG
- ✅ Dual-agent verification (anti-hallucination)

### Coming Soon
- 🔄 Deeper RAG sources (Indian Contract, Copyright, IT Acts)
- 📧 Gmail integration for auto-send
- 📅 Google Calendar reminders
- 🎯 Predictive risk scoring
- 💰 Auto-invoicing

## 🛠️ Project Structure

```
synthlaw/
├── src/
│   ├── ai/
│   │   ├── analyzer.ts          # Heuristic contract brain
│   │   ├── index.ts             # Express API server
│   │   └── utils/
│   │       └── document-processor.ts
│   ├── components/              # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── ContractAnalyzer.tsx
│   │   ├── ContractUpload.tsx
│   │   └── AnalysisResults.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── README.md
```

## 🔐 Privacy & Security

- Automatic PII masking (Aadhaar, bank details)
- Local processing - documents never stored permanently
- Enterprise-grade data handling

## 📝 License

Built for GDG (Google Developer Groups) - Educational purposes

## 🤝 Contributing

This is a hackathon project. Feel free to fork and enhance!

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for the 15 Million Indian Freelancers**
