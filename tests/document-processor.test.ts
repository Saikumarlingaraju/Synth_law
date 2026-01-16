import { describe, it, expect, vi } from 'vitest'

// Mock pdf-parse so we exercise our extraction flow without depending on native PDF rendering
vi.mock('pdf-parse', () => ({
  default: async () => ({
    text: 'Freelancer assigns all intellectual property in perpetuity. Payment terms are Net-90 after invoice. Unlimited liability applies.'
  })
}))

const { extractContractText } = await import('../src/ai/utils/document-processor.js')

describe('extractContractText', () => {
  it('extracts text from a text-based PDF', async () => {
    const buffer = Buffer.from('mock-pdf');

    const text = await extractContractText({
      buffer,
      originalname: 'sample.pdf',
      mimetype: 'application/pdf',
    });

    expect(text).toMatch(/intellectual property/i);
    expect(text).toMatch(/Net-90/i);
    expect(text.length).toBeGreaterThan(20);
  });
});
