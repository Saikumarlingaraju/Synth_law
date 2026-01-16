import { describe, it, expect } from 'vitest'
import { analyzeContract } from '../src/ai/analyzer.js'

const SAMPLE_CONTRACT = `
The freelancer assigns all intellectual property to the client in perpetuity and waives moral rights.
Payment terms are Net-90 from the date of invoice.
The freelancer agrees to indemnify and hold harmless the client for all losses with unlimited liability.
This agreement is governed by Delaware courts.
`;

describe('analyzeContract', () => {
  it('detects major risk patterns and produces negotiation output', async () => {
    const result = await analyzeContract(SAMPLE_CONTRACT);

    const ids = result.risks.map((r) => r.id);

    expect(ids).toContain('ip_transfer');
    expect(ids).toContain('net_payment');
    expect(ids).toContain('unlimited_liability');
    expect(result.riskScore).toBeGreaterThan(0);
    expect(result.simplification.simplifiedText.length).toBeGreaterThan(0);
    expect(result.negotiation.draftEmail.length).toBeGreaterThan(0);
  });
});
