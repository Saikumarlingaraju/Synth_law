import { initializeRAG, enhanceWithRAG, generateSmartNegotiation, EnhancedInsight } from './rag-engine.js';

// Initialize RAG engine on module load
initializeRAG();

type Severity = 'high' | 'medium' | 'low';

type LanguageKey = 'en' | 'hi' | 'te';

interface SummarySnippets {
  en: string;
  hi: string;
  te: string;
}

interface NegotiationPlan {
  issue: (ctx: RiskContext) => string;
  goal: string;
  proposal: string;
}

interface RiskPattern {
  id: string;
  clause: string;
  defaultSeverity: Severity;
  legalReference: string;
  keywords?: RegExp[];
  detector?: (text: string) => DetectionOutcome | null;
  explain: (ctx: RiskContext) => string;
  summary: SummarySnippets;
  negotiation: NegotiationPlan;
}

interface DetectionOutcome {
  severity?: Severity;
  snippet?: string;
  meta?: Record<string, string | number>;
}

interface RiskContext {
  severity: Severity;
  snippet?: string;
  meta?: Record<string, string | number>;
}

export interface RiskInsight {
  id: string;
  clause: string;
  severity: Severity;
  explanation: string;
  legalReference: string;
  snippet?: string;
  summary?: SummarySnippets;
  negotiation?: Omit<NegotiationPlan, 'issue'> & { issue: string };
}

export interface SimplificationInsight {
  originalText: string;
  simplifiedText: string;
  translations: Record<string, string>;
}

export interface NegotiationInsight {
  issues: string[];
  draftEmail: string;
  userGoals: string[];
  emailDraft?: string; // For RAG-enhanced drafts
  calendarReminder?: {
    title: string;
    date: string;
    description: string;
  };
}

export interface AnalysisResult {
  riskScore: number;
  risks: RiskInsight[];
  simplification: SimplificationInsight;
  negotiation: NegotiationInsight;
  ragInsights?: EnhancedInsight | null;
}

const BASE_SUMMARY: Record<LanguageKey, string> = {
  en: 'Synth-Law reviewed the agreement and spotted the following red flags for a freelancer.',
  hi: 'Synth-Law ने अनुबंध की समीक्षा की और एक फ्रीलांसर के लिए ये खतरे पहचाने।',
  te: 'Synth-Law ఒప్పందాన్ని పరిశీలించి ఫ్రీలాన్సర్‌కు ఈ ప్రమాదాలను గుర్తించింది.',
};

const SAFE_SUMMARY: Record<LanguageKey, string> = {
  en: 'Good news: no severe red flags were detected, but document the scope and payment milestones before signing.',
  hi: 'अच्छी खबर: कोई बड़ा खतरा नहीं मिला, फिर भी हस्ताक्षर से पहले स्कोप और भुगतान माइलस्टोन लिखित में रखें।',
  te: 'మంచి వార్త: పెద్ద ప్రమాదాలు కనిపించలేదు, అయినప్పటికీ సంతకం చేసే ముందు పని పరిధి మరియు చెల్లింపు దశలను లిఖితపూర్వకంగా ఉంచండి.',
};

const SUMMARY_CLOSING: Record<LanguageKey, string> = {
  en: 'Ask for revisions before signing so that payment, liability and IP stay balanced.',
  hi: 'हस्ताक्षर करने से पहले इन शर्तों में संशोधन का अनुरोध करें ताकि भुगतान, दायित्व और आईपी संतुलित रहें।',
  te: 'సంతకం చేసే ముందు ఈ నిబంధనలను సరిచేయమని అడగండి, తద్వారా చెల్లింపు, బాధ్యత, ఐపీ సంతులితం అవుతాయి.',
};

const LANGUAGE_LABELS: Record<LanguageKey, string> = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు',
};

const patterns: RiskPattern[] = [
  {
    id: 'ip_transfer',
    clause: 'Perpetual IP Transfer',
    defaultSeverity: 'high',
    legalReference: 'Section 19(5), Copyright Act 1957',
    keywords: [
      /assigns?\s+all\s+(?:intellectual\s+)?property/gi,
      /in\s+perpetuity/gi,
      /perpetual\s+(?:license|rights)/gi,
    ],
    explain: ({ snippet }) => {
      const fragment = snippet ? ` The clause includes: "${snippet}".` : '';
      return 'The agreement permanently assigns all intellectual property and moral rights to the client, leaving you with no portfolio or reuse rights.' + fragment;
    },
    summary: {
      en: 'All intellectual property is permanently assigned to the client; you lose future reuse or portfolio rights.',
      hi: 'आप सभी बौद्धिक संपदा अधिकार स्थायी रूप से क्लाइंट को दे रहे हैं; आप इसे भविष्य में दोबारा उपयोग या पोर्टफोलियो में नहीं दिखा पाएंगे।',
      te: 'మీరు సమస్త మేధోసంపత్తి హక్కులను శాశ్వతంగా క్లయింట్‌కు ఇస్తున్నారు; భవిష్యత్తులో మళ్లీ ఉపయోగించడానికి లేదా పోర్ట్‌ఫోలియోలో చూపడానికి వీలుండదు.',
    },
    negotiation: {
      issue: () => 'The contract transfers all intellectual property to the client in perpetuity without extra compensation.',
      goal: 'Retain portfolio rights or grant only a limited-use licence.',
      proposal: 'Grant the client an exclusive licence for the project deliverables while retaining creator portfolio and future reuse rights.',
    },
  },
  {
    id: 'net_payment',
    clause: 'Delayed Payment Terms',
    defaultSeverity: 'medium',
    legalReference: 'Section 73, Indian Contract Act 1872',
    detector: (text) => {
      const netMatch = text.match(/net[-\s]?(\d{2,3})/i);
      if (netMatch) {
        const days = Number(netMatch[1]);
        const severity: Severity = days >= 60 ? 'high' : days >= 45 ? 'medium' : 'low';
        return {
          severity,
          snippet: extractSnippet(text, netMatch.index ?? 0),
          meta: { days },
        };
      }
      const withinMatch = text.match(/within\s+(ninety|sixty|seventy|\d{2,3})\s+days/i);
      if (withinMatch) {
        const raw = withinMatch[1].toLowerCase();
        const days = parseSpelledNumber(raw);
        if (days) {
          const severity: Severity = days >= 60 ? 'high' : days >= 45 ? 'medium' : 'low';
          return {
            severity,
            snippet: extractSnippet(text, withinMatch.index ?? 0),
            meta: { days },
          };
        }
      }
      return null;
    },
    explain: ({ snippet, meta }) => {
      const days = meta?.days as number | undefined;
      const fragment = days ? ` Payment is scheduled ${days} days after invoice, which is risky for cash flow.` : ' The payment delay exposes you to cash-flow gaps and non-payment risk.';
      const clause = snippet ? ` Clause excerpt: "${snippet}".` : '';
      return 'The payment timeline is heavily deferred in favour of the client.' + fragment + clause;
    },
    summary: {
      en: 'Payment is pushed far out, creating a cash-flow gap and higher non-payment risk.',
      hi: 'भुगतान बहुत देर से तय किया गया है, जिससे नकदी प्रवाह पर दबाव और न मिलने का जोखिम बढ़ जाता है।',
      te: 'చెల్లింపు చాలా ఆలస్యంగా ఉంది, దాంతో నగదు ప్రవాహంపై ఒత్తిడి మరియు చెల్లించకపోవడం వంటి ప్రమాదం పెరుగుతుంది.',
    },
    negotiation: {
      issue: (ctx) => {
        const days = ctx.meta?.days;
        if (typeof days === 'number') {
          return `The contract sets payment ${days} days after invoicing, which is unsustainable for a freelancer.`;
        }
        return 'The contract delays payment significantly after delivery, which strains freelancer cash flow.';
      },
      goal: 'Secure upfront or milestone-based payments within 30 days.',
      proposal: 'Request 50% upfront, 25% on first milestone and the balance within 30 days of delivery.',
    },
  },
  {
    id: 'unlimited_liability',
    clause: 'Unlimited Liability & Broad Indemnity',
    defaultSeverity: 'high',
    legalReference: 'Section 124, Indian Contract Act 1872',
    keywords: [
      /unlimited\s+liability/gi,
      /without\s+limit\s+of\s+liability/gi,
      /indemnify\s+and\s+hold\s+harmless/gi,
      /all\s+losses\s+and\s+expenses/gi,
    ],
    explain: ({ snippet }) => {
      const fragment = snippet ? ` Example: "${snippet}".` : '';
      return 'You agree to indemnify the client for every loss without any monetary cap or fault threshold, exposing you to unlimited financial risk.' + fragment;
    },
    summary: {
      en: 'An unlimited indemnity makes you financially responsible for every loss, even beyond your fees.',
      hi: 'असीमित क्षतिपूर्ति आपको हर नुकसान के लिए जिम्मेदार बनाती है, जो आपकी फीस से भी अधिक हो सकता है।',
      te: 'అపరిమిత పరిహార ధనం అన్ని నష్టాలకు మీరు బాధ్యత వహించాల్సిందేనని చెబుతుంది, ఇది మీ ఫీజును మించిపోగలదు.',
    },
    negotiation: {
      issue: () => 'The indemnity clause has no financial cap and covers all losses, including indirect damages.',
      goal: 'Cap liability to the project value and limit indemnity to direct losses caused by proven negligence.',
      proposal: 'Limit liability to the total fees paid and restrict indemnity to direct damages resulting from proven misconduct.',
    },
  },
  {
    id: 'foreign_jurisdiction',
    clause: 'Foreign Governing Law',
    defaultSeverity: 'medium',
    legalReference: 'Section 28, Indian Contract Act 1872',
    keywords: [
      /courts?\s+of\s+(delaware|new\s+york|california|united\s+states|singapore|england|wales|london)/gi,
      /laws\s+of\s+(delaware|new\s+york|california|united\s+states|england|wales)/gi,
    ],
    explain: ({ snippet }) => {
      const fragment = snippet ? ` Quoted text: "${snippet}".` : '';
      return 'Any disputes must be resolved in a foreign jurisdiction, making enforcement costly and impractical for an Indian freelancer.' + fragment;
    },
    summary: {
      en: 'Disputes are forced into a foreign court, raising legal costs if conflict arises.',
      hi: 'विवाद विदेशी अदालत में ही निपटाने होंगे, जिससे कानूनी खर्च बहुत बढ़ जाएगा।',
      te: 'వివాదం వస్తే విదేశీ కోర్టులోనే తీర్మానించాలని ఉండటం వలన న్యాయ ఖర్చులు పెరుగుతాయి.',
    },
    negotiation: {
      issue: () => 'The governing law and jurisdiction are set outside India, increasing legal costs and barriers.',
      goal: 'Move jurisdiction to India or use neutral online arbitration.',
      proposal: 'Propose Indian law with Mumbai or Bengaluru jurisdiction, or adopt a neutral online arbitration forum.',
    },
  },
  {
    id: 'non_compete',
    clause: 'Broad Non-Compete Restriction',
    defaultSeverity: 'medium',
    legalReference: 'Section 27, Indian Contract Act 1872',
    keywords: [
      /non[-\s]?compete/gi,
      /shall\s+not\s+engage\s+in\s+similar\s+work/gi,
      /any\s+competitor/gi,
    ],
    explain: ({ snippet }) => {
      const fragment = snippet ? ` Restrictive text: "${snippet}".` : '';
      return 'The non-compete clause blocks you from working with other clients or in your own niche for an extended period, which is unenforceable under Indian law.' + fragment;
    },
    summary: {
      en: 'The non-compete clause locks you out of similar work for months or years after this project.',
      hi: 'नॉन-कम्पीट शर्त आपको इस प्रोजेक्ट के बाद भी लंबे समय तक समान काम से दूर रखती है।',
      te: 'ఈ నాన్-కంపీట్ నిబంధన ప్రాజెక్ట్ తరువాత కూడా సమానమైన పనిని చేయకుండా నిలుపుతుంది.',
    },
    negotiation: {
      issue: () => 'The non-compete language is broad enough to block future freelance opportunities.',
      goal: 'Limit restrictions to direct client leads during the project only.',
      proposal: 'Replace with a simple non-solicitation clause limited to active project contacts for 3 months.',
    },
  },
  {
    id: 'termination_imbalance',
    clause: 'Unbalanced Termination Notice',
    defaultSeverity: 'medium',
    legalReference: 'Section 23, Indian Contract Act 1872',
    detector: (text) => {
      const clientMatch = text.match(/may\s+terminate[^.]{0,80}?\b(\d{1,2})\s*(?:day|days)/i);
      const freelancerMatch = text.match(/service\s+provider[^.]{0,80}?\b(\d{1,2})\s*(?:day|days)/i);
      if (clientMatch && freelancerMatch) {
        const clientDays = Number(clientMatch[1]);
        const freelancerDays = Number(freelancerMatch[1]);
        if (!Number.isNaN(clientDays) && !Number.isNaN(freelancerDays) && clientDays < freelancerDays) {
          return {
            severity: freelancerDays - clientDays >= 14 ? 'medium' : 'low',
            snippet: combineSnippets([clientMatch, freelancerMatch], text),
            meta: { clientDays, freelancerDays },
          };
        }
      }
      return null;
    },
    explain: ({ snippet, meta }) => {
      const clientDays = meta?.clientDays as number | undefined;
      const freelancerDays = meta?.freelancerDays as number | undefined;
      const imbalance = clientDays && freelancerDays ? ` The client needs only ${clientDays} days notice but you must give ${freelancerDays} days.` : '';
      const fragment = snippet ? ` Highlight: "${snippet}".` : '';
      return 'Termination notice periods are one-sided and let the client exit faster than you can.' + imbalance + fragment;
    },
    summary: {
      en: 'Termination timelines favour the client, meaning they can exit quickly while you stay locked in.',
      hi: 'समाप्ति की समयसीमा क्लाइंट के पक्ष में है, यानी वे जल्दी निकल सकते हैं लेकिन आप फंस जाते हैं।',
      te: 'రద్దు టైమ్‌లైన్ క్లయింట్‌కు అనుకూలంగా ఉండడంతో, వారు వేగంగా బయటకు రావచ్చు కానీ మీరు ఇరుక్కోవాల్సి వస్తుంది.',
    },
    negotiation: {
      issue: (ctx) => {
        const clientDays = ctx.meta?.clientDays as number | undefined;
        const freelancerDays = ctx.meta?.freelancerDays as number | undefined;
        if (clientDays && freelancerDays) {
          return `Termination notice is ${clientDays} days for the client but ${freelancerDays} days for me, which is uneven.`;
        }
        return 'Termination notice periods are uneven and place more risk on the freelancer.';
      },
      goal: 'Make termination notice periods mutual and balanced.',
      proposal: 'Set a mutual 14-day notice or require payment for work completed if termination is early.',
    },
  },
  {
    id: 'confidentiality_indefinite',
    clause: 'Indefinite Confidentiality Obligation',
    defaultSeverity: 'low',
    legalReference: 'Rule 8, SPDI Rules under IT Act 2000',
    keywords: [
      /confidentiality[^.]{0,100}survive[s]?\s+termination/gi,
      /in\s+perpetuity\s+confidential/gi,
      /indefinite\s+confidentiality/gi,
    ],
    explain: ({ snippet }) => {
      const fragment = snippet ? ` Wording seen: "${snippet}".` : '';
      return 'Confidentiality survives forever without a practical time-limit, which is uncommon for freelance projects.' + fragment;
    },
    summary: {
      en: 'Confidentiality obligations last forever, so you must seek permission even years later.',
      hi: 'गोपनीयता की जिम्मेदारी हमेशा के लिए चलती है, इसलिए आपको वर्षों बाद भी अनुमति लेनी होगी।',
      te: 'రహస్యత్వ బాధ్యత శాశ్వతంగా కొనసాగుతుంది, కాబట్టి సంవత్సరాల తరువాత కూడా అనుమతి తీసుకోవాలి.',
    },
    negotiation: {
      issue: () => 'The confidentiality clause has no end-date, which is impractical for long-term careers.',
      goal: 'Limit confidentiality obligations to a reasonable 2-3 year window.',
      proposal: 'Cap confidentiality obligations to 3 years after project completion, with standard exceptions.',
    },
  },
];

export function maskSensitiveData(text: string): string {
  return text
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[REDACTED-AADHAAR]')
    .replace(/\b\d{10}\b/g, '[REDACTED-PHONE]')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED-EMAIL]');
}

export async function analyzeContract(rawText: string): Promise<AnalysisResult> {
  const sanitized = maskSensitiveData(rawText.trim());
  const risks = detectRisks(sanitized);
  const riskScore = calculateRiskScore(risks);
  const simplification = buildSimplification(sanitized, risks);
  
  // Try RAG-enhanced negotiation first, fallback to rule-based
  let negotiation: NegotiationInsight;
  try {
    const enhancedEmail = await generateSmartNegotiation(
      risks.map(r => ({
        clause: r.clause,
        severity: r.severity,
        negotiation: r.negotiation ? {
          issue: r.negotiation.issue,
          proposal: r.negotiation.proposal,
        } : undefined,
      }))
    );
    negotiation = {
      issues: [],
      draftEmail: enhancedEmail,
      userGoals: [],
      emailDraft: enhancedEmail,
      calendarReminder: buildCalendarReminder(),
    };
  } catch (error) {
    console.log('RAG unavailable, using rule-based negotiation');
    negotiation = buildNegotiation(risks);
  }

  // Optionally enhance with RAG for legal grounding
  let ragInsights: EnhancedInsight | null = null;
  try {
    ragInsights = await enhanceWithRAG({
      contractText: sanitized,
      detectedRisks: risks.map(r => ({
        clause: r.clause,
        severity: r.severity,
        snippet: r.snippet,
      })),
    });
  } catch (error) {
    console.log('RAG enhancement unavailable, continuing with heuristics');
  }

  return {
    riskScore,
    risks,
    simplification,
    negotiation,
    ragInsights, // Additional context if available
  };
}

function detectRisks(text: string): RiskInsight[] {
  const results: RiskInsight[] = [];

  for (const pattern of patterns) {
    const detection = pattern.detector ? pattern.detector(text) : matchByKeywords(pattern, text);
    if (!detection) {
      continue;
    }

    const ctx: RiskContext = {
      severity: detection.severity ?? pattern.defaultSeverity,
      snippet: detection.snippet,
      meta: detection.meta,
    };

    const explanation = pattern.explain(ctx);
    const risk: RiskInsight = {
      id: pattern.id,
      clause: pattern.clause,
      severity: ctx.severity,
      explanation,
      legalReference: pattern.legalReference,
      snippet: ctx.snippet,
      summary: pattern.summary,
      negotiation: {
        goal: pattern.negotiation.goal,
        proposal: pattern.negotiation.proposal,
        issue: pattern.negotiation.issue(ctx),
      },
    };

    results.push(risk);
  }

  return results.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));
}

function matchByKeywords(pattern: RiskPattern, text: string): DetectionOutcome | null {
  if (!pattern.keywords) return null;
  for (const regex of pattern.keywords) {
    // Reset regex state to avoid caching issues
    regex.lastIndex = 0;
    const match = regex.exec(text);
    if (match && typeof match.index === 'number') {
      return {
        severity: pattern.defaultSeverity,
        snippet: extractSnippet(text, match.index),
      };
    }
  }
  return null;
}

function buildSimplification(text: string, risks: RiskInsight[]): SimplificationInsight {
  const intro = risks.length > 0 ? BASE_SUMMARY : SAFE_SUMMARY;
  const closing = risks.length > 0 ? SUMMARY_CLOSING : {
    en: '',
    hi: '',
    te: '',
  };

  const summaryByLang: Record<LanguageKey, string[]> = {
    en: [intro.en],
    hi: [intro.hi],
    te: [intro.te],
  };

  for (const risk of risks) {
    if (!risk.summary) continue;
    summaryByLang.en.push(risk.summary.en);
    summaryByLang.hi.push(risk.summary.hi);
    summaryByLang.te.push(risk.summary.te);
  }

  if (closing.en) {
    summaryByLang.en.push(closing.en);
    summaryByLang.hi.push(closing.hi);
    summaryByLang.te.push(closing.te);
  }

  const simplifiedText = dedupeSentences(summaryByLang.en).join(' ');
  const translations: Record<string, string> = {
    hindi: dedupeSentences(summaryByLang.hi).join(' '),
    telugu: dedupeSentences(summaryByLang.te).join(' '),
  };

  const originalText = text.slice(0, 800).replace(/\s+/g, ' ').trim();

  return {
    originalText,
    simplifiedText,
    translations,
  };
}

function buildNegotiation(risks: RiskInsight[]): NegotiationInsight {
  if (risks.length === 0) {
    const friendlyEmail = `Subject: Quick Confirmation on Contract Terms\n\nHi [Client Name],\n\nThanks for sharing the agreement. Everything looks good from my side. For documentation, could we add a short schedule with payment milestones and scope sign-off? That helps me track timelines and keep you updated.\n\nAppreciate it and excited to start!\n\nBest regards,\n[Your Name]\nSynth-Law Agentic Assistant`;
    return {
      issues: ['No material red flags detected. Request a scope and payment addendum for clarity.'],
      userGoals: ['Document payment milestones'],
      draftEmail: friendlyEmail,
      calendarReminder: buildCalendarReminder(),
    };
  }

  const issues = risks.map((risk) => risk.negotiation?.issue ?? risk.explanation);
  const goals = Array.from(new Set(risks.map((risk) => risk.negotiation?.goal).filter(Boolean))) as string[];

  const bulletPoints = risks.map((risk, index) => {
    const headline = risk.negotiation?.issue ?? risk.clause;
    const proposal = risk.negotiation?.proposal ?? 'Please suggest an alternative that keeps the engagement balanced for both sides.';
    return `${index + 1}. ${headline}\n   Suggested change: ${proposal}`;
  });

  const email = `Subject: Request for Contract Alignment\n\nHi [Client Name],\n\nThank you for sending the agreement. I'm keen to begin, and I want to make sure the terms work well for both of us. A few clauses would benefit from small adjustments so I can deliver with full focus:\n\n${bulletPoints.join('\n\n')}\n\nThese updates mirror standard freelancer terms in India and will let me prioritise your project without unexpected risk. Once we align on them I'm ready to kick off immediately.\n\nLet me know if we can sync over a quick call or you can send an updated draft—whatever is easier for you.\n\nBest regards,\n[Your Name]\nSynth-Law Agentic Assistant`;

  return {
    issues,
    userGoals: goals.length > 0 ? goals : ['Balance payment and liability terms'],
    draftEmail: email,
    calendarReminder: buildCalendarReminder('Follow-up on contract negotiation'),
  };
}

function buildCalendarReminder(title?: string): { title: string; date: string; description: string } {
  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + 3); // 3 days from now

  return {
    title: title || 'Follow up on contract negotiation',
    date: followUpDate.toISOString().split('T')[0],
    description: `
      Reminder: Follow up with client on contract changes.
      
      Prepared by: Synth-Law AI Assistant
      Status: Awaiting client response
      
      Next steps:
      1. Send negotiation email if not already sent
      2. Check for client response
      3. Escalate if no response after 3 days
    `.trim(),
  };
}

function calculateRiskScore(risks: RiskInsight[]): number {
  if (risks.length === 0) {
    return 10;
  }
  const weights: Record<Severity, number> = {
    high: 30,
    medium: 15,
    low: 5,
  };
  const total = risks.reduce((acc, risk) => acc + (weights[risk.severity] ?? 0), 0);
  return Math.min(100, total);
}

function severityOrder(severity: Severity): number {
  switch (severity) {
    case 'high':
      return 0;
    case 'medium':
      return 1;
    default:
      return 2;
  }
}

function extractSnippet(text: string, index: number, window = 160): string {
  const start = Math.max(0, index - Math.floor(window / 2));
  const end = Math.min(text.length, index + Math.floor(window / 2));
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function combineSnippets(matches: RegExpMatchArray[], text: string): string {
  const positions = matches
    .map((match) => match.index ?? 0)
    .sort((a, b) => a - b);
  if (positions.length === 0) {
    return '';
  }
  return extractSnippet(text, positions[0]);
}

function parseSpelledNumber(raw: string): number | null {
  const dictionary: Record<string, number> = {
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  };
  if (dictionary[raw]) {
    return dictionary[raw];
  }
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : null;
}

function dedupeSentences(lines: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

export function describeLanguages(): string {
  return Object.entries(LANGUAGE_LABELS)
    .map(([key, label]) => `${label} (${key.toUpperCase()})`)
    .join(', ');
}
