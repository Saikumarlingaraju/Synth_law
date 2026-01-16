import { GoogleGenerativeAI } from '@google/generative-ai';

const LEGAL_KNOWLEDGE_BASE = `
# Indian Contract Act 1872 - Key Sections for Freelancers

Section 10: What agreements are contracts
- All agreements are contracts if made by free consent, for a lawful consideration and with a lawful object.

Section 23: What considerations and objects are lawful
- Forbids agreements opposed to public policy, including unreasonable restraints of trade.

Section 27: Agreement in restraint of trade void
- Every agreement by which anyone is restrained from exercising a lawful profession, trade or business is void to that extent.
- Non-compete clauses that completely prevent freelancers from working are unenforceable.

Section 73: Compensation for loss or damage caused by breach of contract
- When a contract has been broken, the party who suffers by such breach is entitled to receive compensation for any loss or damage caused.
- Includes compensation for delayed payments.

Section 74: Compensation for breach of contract where penalty stipulated
- Liquidated damages must be reasonable estimates of probable loss, not punitive.

Section 124: Contract of indemnity defined
- A contract by which one party promises to save the other from loss caused to him by conduct of the promisor himself.
- Unlimited indemnity clauses may be deemed unconscionable.

Section 230: Agent cannot personally enforce contracts
- An agent cannot personally enforce contracts entered on behalf of his principal.

# Copyright Act 1957

Section 17: First owner of copyright
- The author of a work is the first owner of the copyright therein.
- In case of works made for hire, the employer is the first owner unless agreed otherwise.

Section 18: Assignment of copyright
- The owner of copyright may assign copyright either wholly or partially.
- Assignment must be in writing and specify the rights assigned.

Section 19: Mode of assignment
- Assignment of copyright must identify the work, specify rights assigned, specify duration and territorial extent.

Section 19(5): Rights revert to author
- In case of assignment of copyright, if the assignee does not exercise rights within one year, rights may revert to the author.

# Information Technology Act 2000

Section 43A: Compensation for failure to protect data
- Body corporate that fails to protect sensitive personal data is liable to pay damages.

Section 72: Breach of confidentiality and privacy
- Penalty for disclosure of information in breach of lawful contract.

Rule 8: Security practices and procedures (SPDI Rules)
- Reasonable security practices for protecting sensitive personal data.
- Indefinite confidentiality obligations must align with data retention principles.

# MSME (Micro, Small and Medium Enterprises) Development Act 2006

Section 15: Liability of buyer to make payment
- Buyer shall make payment on or before the agreed date.

Section 16: Date from which amount agreed to be paid becomes due
- If no agreement, payment becomes due immediately on the day of acceptance/deemed acceptance.

Section 17: Rate of interest payable by buyer
- If payment not made on agreed date, compound interest at three times the bank rate notified by RBI.
- Protects small service providers from delayed payments.

# Common Predatory Contract Patterns in Indian Freelance Context

1. Perpetual IP Transfer Without Compensation
   - Indian law: Section 19(5) Copyright Act allows reversion if rights not exercised
   - Fair alternative: Limited exclusive license with portfolio rights retained

2. Net-60/90/120 Payment Terms
   - MSME Act Section 17: Freelancers can claim 3x bank rate interest on delays
   - Standard practice: 30-50% upfront, balance within 30 days of delivery

3. Unlimited Liability Clauses
   - Section 74 ICA: Penalties must be reasonable
   - Section 124 ICA: Indemnity must be proportionate
   - Fair cap: Total project value

4. Foreign Jurisdiction Clauses
   - Section 28 ICA: Cannot oust Indian courts of jurisdiction
   - Practical barrier: Makes enforcement impossible for freelancers
   - Fair alternative: Indian arbitration in Mumbai/Bengaluru

5. Broad Non-Compete
   - Section 27 ICA: Restraint of trade agreements are void
   - Only narrow non-solicitation (3-6 months, specific clients) may be reasonable

6. Unilateral Termination
   - Section 73 ICA: Compensation for breach
   - Fair practice: Equal notice periods or payment for work completed

7. Work-for-Hire Without Clear Scope
   - Section 17 Copyright Act: Author owns unless explicit transfer
   - Fair practice: Clearly defined deliverables with scope boundaries

# Red Flags in Payment Clauses

- "Payment upon client's satisfaction" (subjective, unenforceable)
- "Final payment subject to end-client approval" (passes risk unfairly)
- "Revisions until approved" without revision limit (scope creep)
- "Expenses reimbursed upon receipt submission" without timeline
- Milestone payments tied to events outside freelancer control

# Fair Freelancer Contract Standards

Payment:
- 30-50% upfront for new clients
- Milestone-based for large projects
- Final payment within 30 days of delivery
- Clear late payment penalties (MSME Act protection)

IP Rights:
- Client gets exclusive license for agreed use-case
- Freelancer retains portfolio rights
- Moral rights acknowledged (especially for creative work)
- Clear transfer only for agreed deliverables, not incidental work

Liability:
- Capped at project value
- Limited to direct damages from proven negligence
- Excludes consequential/indirect damages
- Client responsible for their content/instructions

Termination:
- Equal notice periods (14 days standard)
- Payment for work completed to date
- Return of materials/files within reasonable time
- Clear final deliverable handover process

Confidentiality:
- Defined scope (not "all information")
- Reasonable duration (2-3 years post-project)
- Standard exceptions (public domain, prior knowledge, legal requirement)

Dispute Resolution:
- Indian law and jurisdiction
- Mediation before arbitration
- Arbitration in major Indian cities
- English as language of arbitration
`;

export interface LegalContext {
  relevantSections: string[];
  precedents: string[];
  standardPractices: string[];
}

export interface EnhancedAnalysisParams {
  contractText: string;
  detectedRisks: Array<{
    clause: string;
    severity: string;
    snippet?: string;
  }>;
}

export interface EnhancedInsight {
  legalGrounding: LegalContext;
  alternativeLanguage: {
    hindi: string;
    telugu: string;
  };
  negotiationStrategy: {
    tone: 'assertive' | 'collaborative' | 'defensive';
    priority: number;
    emailTemplate: string;
  };
}

let genAI: GoogleGenerativeAI | null = null;

export function initializeRAG(apiKey?: string): void {
  const key = apiKey || process.env.GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY;
  if (!key) {
    console.warn('⚠️  No Google API key found. RAG features will use fallback mode.');
    return;
  }
  
  try {
    genAI = new GoogleGenerativeAI(key);
    console.log('✅ RAG engine initialized (Gemini client ready)');
  } catch (error) {
    console.error('Failed to initialize RAG:', error);
    genAI = null;
  }
}

export async function enhanceWithRAG(
  params: EnhancedAnalysisParams
): Promise<EnhancedInsight | null> {
  if (!genAI) {
    console.log('📚 RAG not initialized, skipping AI enhancement');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4000,
      },
    });

    const riskSummary = params.detectedRisks
      .map((r, i) => `${i + 1}. ${r.clause} (${r.severity}): ${r.snippet || 'N/A'}`)
      .join('\n');

    const prompt = `You are a legal AI assistant specializing in Indian contract law for freelancers.

LEGAL KNOWLEDGE BASE:
${LEGAL_KNOWLEDGE_BASE}

DETECTED RISKS IN CONTRACT:
${riskSummary}

CONTRACT EXCERPT:
${params.contractText.substring(0, 2000)}

TASK:
Provide enhanced analysis in JSON format with:
1. Legal grounding (cite specific sections from knowledge base)
2. Hindi and Telugu translations of the 3 most critical issues
3. Negotiation strategy with professional email template

Return ONLY valid JSON:
{
  "legalGrounding": {
    "relevantSections": ["Section X: explanation", "Section Y: explanation"],
    "precedents": ["Case reference or standard practice"],
    "standardPractices": ["Industry norm 1", "Industry norm 2"]
  },
  "alternativeLanguage": {
    "hindi": "मुख्य समस्या का हिंदी में विवरण",
    "telugu": "ప్రధాన సమస్య తెలుగులో వివరణ"
  },
  "negotiationStrategy": {
    "tone": "collaborative",
    "priority": 8,
    "emailTemplate": "Professional email template here"
  }
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No valid JSON in RAG response');
      return null;
    }

    const enhanced = JSON.parse(jsonMatch[0]);
    return enhanced as EnhancedInsight;
    
  } catch (error) {
    if (error instanceof Error && /404/.test(error.message)) {
      console.warn('RAG enhancement skipped: model not available (404)');
      return null;
    }
    console.error('RAG enhancement error:', error);
    return null;
  }
}

export async function generateSmartNegotiation(
  risks: Array<{ clause: string; severity: string; negotiation?: { issue: string; proposal: string } }>,
  userGoals: string[] = []
): Promise<string> {
  if (!genAI) {
    return generateFallbackEmail(risks);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2000,
      },
    });

    const riskDetails = risks
      .filter(r => r.severity === 'high' || r.severity === 'medium')
      .slice(0, 5)
      .map((r, i) => {
        const issue = r.negotiation?.issue || r.clause;
        const proposal = r.negotiation?.proposal || 'Request reasonable amendment';
        return `${i + 1}. ${issue}\n   Suggested change: ${proposal}`;
      })
      .join('\n\n');

    const goalsText = userGoals.length > 0 
      ? `\n\nUser's specific goals:\n${userGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}`
      : '';

    const prompt = `You are drafting a professional contract negotiation email for an Indian freelancer.

LEGAL CONTEXT:
- Use respectful but firm tone
- Reference Indian Contract Act and Copyright Act where relevant
- Maintain collaborative business relationship
- Be specific about requested changes

RISKS TO ADDRESS:
${riskDetails}${goalsText}

Write a complete email with:
- Professional subject line
- Courteous opening
- Clear enumeration of issues with proposed solutions
- Emphasis on mutual benefit
- Closing that invites discussion

Return ONLY the email text (no JSON wrapper).`;

    const result = await model.generateContent(prompt);
    return result.response.text();
    
  } catch (error) {
    if (error instanceof Error && /404/.test(error.message)) {
      console.warn('Smart negotiation skipped: model not available (404)');
      return generateFallbackEmail(risks);
    }
    console.error('Smart negotiation error:', error);
    return generateFallbackEmail(risks);
  }
}

function generateFallbackEmail(risks: Array<{ clause: string; negotiation?: { issue: string; proposal: string } }>): string {
  const points = risks
    .filter(r => r.negotiation)
    .slice(0, 4)
    .map((r, i) => `${i + 1}. ${r.negotiation!.issue}\n   Suggested change: ${r.negotiation!.proposal}`)
    .join('\n\n');

  return `Subject: Request for Contract Alignment

Hi [Client Name],

Thank you for sharing the agreement. I'm excited to collaborate and want to ensure the terms work well for both of us. A few clauses would benefit from small adjustments:

${points}

These updates align with standard freelancer terms in India and will help me deliver my best work without unexpected risk. Once we align on these points, I'm ready to start immediately.

Would you be available for a quick call to discuss, or should I expect a revised draft?

Best regards,
[Your Name]
Synth-Law AI Assistant`;
}

export async function translateToRegionalLanguages(
  text: string,
  targetLanguages: string[] = ['hindi', 'telugu']
): Promise<Record<string, string>> {
  if (!genAI) {
    return {
      hindi: 'अनुवाद उपलब्ध नहीं है (कोई API कुंजी नहीं)',
      telugu: 'అనువాదం అందుబాటులో లేదు (API కీ లేదు)',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    });

    const results: Record<string, string> = {};

    for (const lang of targetLanguages) {
      const langName = lang === 'hindi' ? 'Hindi' : lang === 'telugu' ? 'Telugu' : lang;
      const prompt = `Translate this plain-English contract summary into ${langName}. Keep it simple and clear for non-legal readers.

TEXT TO TRANSLATE:
${text}

Return ONLY the ${langName} translation, no additional text.`;

      const result = await model.generateContent(prompt);
      results[lang] = result.response.text().trim();
    }

    return results;
    
  } catch (error) {
    console.error('Translation error:', error);
    return {
      hindi: 'अनुवाद त्रुटि',
      telugu: 'అనువాద లోపం',
    };
  }
}

export { LEGAL_KNOWLEDGE_BASE };
