import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export async function extractContractText(file: UploadedFile): Promise<string> {
  const { buffer, mimetype, originalname } = file;

  console.log('Extracting text from:', originalname, 'Type:', mimetype);

  let extractedText = '';

  try {
    // PDF extraction
    if (mimetype === 'application/pdf') {
      extractedText = await extractFromPDF(buffer);
      if (!extractedText?.trim()) {
        console.log('PDF had no text; attempting OCR fallback');
        extractedText = await extractFromPDFWithOCR(buffer);
      }
    }
    // Word document extraction
    else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      extractedText = await extractFromWord(buffer);
    }
    // Image extraction (OCR)
    else if (mimetype.startsWith('image/')) {
      extractedText = await extractFromImage(buffer);
    }
    else {
      throw new Error('Unsupported file type: ' + mimetype);
    }

    // Check if we got any text
    const trimmedText = extractedText ? extractedText.trim() : '';
    
    console.log('Extraction summary:', {
      totalLength: extractedText?.length || 0,
      trimmedLength: trimmedText.length,
      firstChars: trimmedText.substring(0, 100)
    });

    if (!trimmedText || trimmedText.length === 0) {
      console.warn('No text extracted from document');
      throw new Error('No readable text found in document. The PDF may be scanned or image-based. Try uploading as an image for OCR.');
    }

    console.log('✅ Successfully extracted', trimmedText.length, 'characters from', originalname);
    return extractedText;

  } catch (error) {
    console.error('Text extraction failed for', originalname, error);
    throw error;
  }
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    
    console.log('PDF extraction result:', {
      textLength: data.text?.length || 0,
      numPages: data.numpages,
      hasText: !!data.text
    });
    
    if (!data.text) {
      console.warn('PDF parsed but no text property found');
      return '';
    }
    
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

async function extractFromPDFWithOCR(buffer: Buffer): Promise<string> {
  await ensurePdftoppm();

  try {
    const images = await pdfToImages(buffer);
    if (!images.length) {
      throw new Error('No pages rendered for OCR fallback');
    }

    let fullText = '';
    for (const imageBuffer of images) {
      const pageText = await extractFromImage(imageBuffer);
      fullText += pageText ? `${pageText}\n` : '';
    }

    return fullText;
  } catch (error) {
    console.error('PDF OCR fallback error:', error);
    throw new Error('Failed to OCR PDF pages: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

async function ensurePdftoppm() {
  try {
    await execFileAsync('which', ['pdftoppm']);
  } catch (error) {
    throw new Error('OCR fallback requires poppler-utils (pdftoppm). Install with apt-get install -y poppler-utils.');
  }
}

async function pdfToImages(buffer: Buffer): Promise<Buffer[]> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'synth-pdf-'));
  const pdfPath = path.join(tmpDir, 'input.pdf');
  const prefix = path.join(tmpDir, 'page');

  await fs.writeFile(pdfPath, buffer);

  try {
    await execFileAsync('pdftoppm', ['-png', pdfPath, prefix]);
    const files = await fs.readdir(tmpDir);
    const imageFiles = files
      .filter((name) => name.startsWith('page-') && name.endsWith('.png'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = await Promise.all(imageFiles.map((name) => fs.readFile(path.join(tmpDir, name))));
    return images;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function extractFromWord(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    
    console.log('Word extraction result:', {
      textLength: result.value?.length || 0,
      hasText: !!result.value
    });
    
    if (!result.value) {
      console.warn('Word document parsed but no text found');
      return '';
    }
    
    return result.value;
  } catch (error) {
    console.error('Word extraction error:', error);
    throw new Error('Failed to extract text from Word: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

async function extractFromImage(buffer: Buffer): Promise<string> {
  try {
    const tesseractModule = await import('tesseract.js');
    const recognize = (tesseractModule as any).recognize || (tesseractModule as any).default?.recognize;

    if (typeof recognize !== 'function') {
      throw new Error('Tesseract recognize() not available');
    }

    const { data: { text } } = await recognize(buffer, 'eng');

    console.log('OCR extraction result:', {
      textLength: text?.length || 0,
      hasText: !!text
    });

    if (!text) {
      console.warn('OCR completed but no text found');
      return '';
    }

    return text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from image: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

function getSampleContract(): string {
  return `
FREELANCE SERVICE AGREEMENT

This Freelance Service Agreement ("Agreement") is entered into as of January 16, 2026, by and between XYZ Corporation ("Client") and Freelancer ("Service Provider").

1. SCOPE OF WORK
Service Provider agrees to provide web development services as specified in Exhibit A attached hereto.

2. PAYMENT TERMS
2.1 The total project fee is INR 2,00,000 (Two Lakhs Rupees).
2.2 Payment shall be made within ninety (90) days of invoice submission (Net-90).
2.3 No upfront payment shall be provided.

3. INTELLECTUAL PROPERTY RIGHTS
3.1 All work product, including but not limited to code, designs, documentation, and any derivative works, shall be the exclusive property of the Client.
3.2 Service Provider hereby assigns all right, title, and interest in perpetuity to the Client.
3.3 Service Provider waives all moral rights to the work product.

4. LIABILITY AND INDEMNIFICATION
4.1 Service Provider agrees to indemnify and hold harmless the Client from any and all claims, damages, losses, and expenses, including attorney's fees, arising from the Service Provider's work.
4.2 There shall be no limit to the Service Provider's liability under this Agreement.
4.3 Service Provider's liability shall include consequential damages and lost profits.

5. CONFIDENTIALITY
5.1 Service Provider agrees to maintain strict confidentiality of all Client information.
5.2 Confidentiality obligations shall survive termination of this Agreement indefinitely.

6. TERM AND TERMINATION
6.1 Client may terminate this Agreement at any time with seven (7) days written notice.
6.2 Service Provider may terminate this Agreement with thirty (30) days written notice.
6.3 Upon termination by Service Provider, Client shall have no obligation to pay for work completed.

7. NON-COMPETE
7.1 For a period of two (2) years following termination, Service Provider shall not engage in similar work for any competitor of the Client.

8. DISPUTE RESOLUTION
8.1 Any disputes shall be resolved exclusively in the courts of Delaware, United States.
8.2 Service Provider waives the right to jury trial.

9. GENERAL PROVISIONS
9.1 This Agreement constitutes the entire agreement between the parties.
9.2 This Agreement shall be governed by the laws of Delaware, United States.
9.3 Service Provider is an independent contractor and not an employee.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_______________________          _______________________
Client Signature                 Service Provider Signature
XYZ Corporation                  [Your Name]
`;
}
