import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { extractContractText } from './utils/document-processor.js';
import { analyzeContract } from './analyzer.js';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Express server for API
const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Main analysis endpoint
app.post('/api/analyze', upload.single('contract'), async (req: Request, res: Response) => {
  try {
    const multerReq = req as MulterRequest;
    if (!multerReq.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    console.log('Processing file:', multerReq.file.originalname);

    // Step 1: Extract text from document
    const contractText = await extractContractText(multerReq.file);
    
    if (!contractText) {
      res.status(400).json({ error: 'Failed to extract text from document' });
      return;
    }

    console.log('Extracted text length:', contractText.length);

    // Step 2: Run contract analysis pipeline
    const analysis = await analyzeContract(contractText);

    // Step 3: Combine results
    const analysisData = {
      fileName: multerReq.file.originalname,
      ...analysis,
    };

    res.json(analysisData);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Synth-Law API is running' });
});

const PORT = process.env.GENKIT_PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Synth-Law API server running on http://localhost:${PORT}`);
  console.log(`📊 Ready to analyze contracts`);
});

export {};
