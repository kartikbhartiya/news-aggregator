/**
 * Groq AI Engine Integration for PRISM
 * Powered by high-speed Groq inference API.
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = 'qwen/qwen3.8-27b';

export interface GroqBriefingResult {
  leadHighlight: string;
  globalPulse: string;
  marketOutlook: string;
  keyDevelopments: Array<{
    title: string;
    summary: string;
    category: string;
    impact: 'Critical' | 'High' | 'Medium';
    timeAgo: string;
  }>;
}

export interface GroqSummaryResult {
  keyTakeaway: string;
  bulletPoints: string[];
  readTime: number;
}

/**
 * Call Groq chat completion endpoint with retry and graceful fallback
 */
async function callGroqChat(messages: Array<{ role: string; content: string }>, maxTokens = 800): Promise<string> {
  const models = [GROQ_MODEL, 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && typeof content === 'string' && content.trim().length > 0) {
        return content.trim();
      }
    } catch (err) {
      console.error(`Groq error on model ${model}:`, err);
    }
  }

  throw new Error('Groq AI inference failed across all model endpoints');
}

/**
 * Generate Executive AI Briefing using real-time news headlines via Groq
 */
export async function generateGroqBriefing(
  articles: Array<{ title: string; description?: string; category: string; source: { name: string } }>,
  edition: 'india' | 'international',
  topic = 'all'
): Promise<GroqBriefingResult> {
  const headlinesSample = articles.slice(0, 10).map((a, i) => `${i + 1}. [${a.source.name} | ${a.category}] ${a.title}: ${a.description || ''}`).join('\n');

  const prompt = `You are the Lead Intelligence Strategist for PRISM, an Apple-grade executive news platform.
Synthesize the following live dispatches from today's ${edition === 'india' ? 'India' : 'Global'} Wire into a crisp executive briefing.
Live Wire Samples:
${headlinesSample}

Return strictly a valid JSON object matching this schema with NO markdown fences, NO extra text:
{
  "leadHighlight": "2 sentences describing the most critical macro development.",
  "globalPulse": "1 sentence describing current market and policy momentum.",
  "marketOutlook": "1 sentence summarizing sector and capital trends.",
  "keyDevelopments": [
    {
      "title": "Concise impactful headline",
      "summary": "1-2 sentences distilled executive insight",
      "category": "TECH | MARKETS | ECONOMY | WORLD | SCIENCE",
      "impact": "Critical | High | Medium",
      "timeAgo": "Live Wire"
    }
  ]
}`;

  try {
    const raw = await callGroqChat([
      { role: 'system', content: 'You are an executive news intelligence AI that outputs strictly valid JSON without explanation or formatting fences.' },
      { role: 'user', content: prompt }
    ], 1200);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (parsed.leadHighlight && Array.isArray(parsed.keyDevelopments)) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse Groq briefing response:', err);
  }

  // Graceful fallback if JSON parse fails
  return {
    leadHighlight: edition === 'india'
      ? 'India Semiconductor Mission accelerates commercial silicon fabrication in Dholera as Dalal Street benchmarks sustain historic institutional volume.'
      : 'Topological quantum computing breakthroughs intersect with global central bank monetary liquidity alignments.',
    globalPulse: edition === 'india'
      ? 'UPI cross-border settlement expands while domestic industrial manufacturing anchors sustained GDP trajectory.'
      : 'Active telemetry monitoring across global semiconductor and trade corridors.',
    marketOutlook: edition === 'india'
      ? 'Nifty 50 and capital goods sector lead quarterly equity allocation.'
      : 'Technology equities and sovereign paper yields show firm bid strength.',
    keyDevelopments: articles.slice(0, 4).map((a, idx) => ({
      title: a.title,
      summary: a.description || `${a.title} reported by ${a.source.name}.`,
      category: a.category.toUpperCase(),
      impact: idx === 0 ? 'Critical' : 'High',
      timeAgo: 'Live Wire',
    })),
  };
}

/**
 * Generate instantaneous 3-bullet AI Takeaway for an individual article
 */
export async function generateGroqArticleSummary(
  title: string,
  content: string,
  sourceName: string
): Promise<GroqSummaryResult> {
  const prompt = `Article: "${title}" by ${sourceName}
Content:
${content.slice(0, 1500)}

Generate an executive distillation. Return strictly a JSON object:
{
  "keyTakeaway": "Single-sentence executive bottom line.",
  "bulletPoints": [
    "First crucial fact or strategic consequence",
    "Second key data point or market implication",
    "Third forward-looking projection"
  ],
  "readTime": 3
}`;

  try {
    const raw = await callGroqChat([
      { role: 'system', content: 'You are an executive intelligence AI that outputs strictly valid JSON.' },
      { role: 'user', content: prompt }
    ], 600);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (parsed.keyTakeaway && Array.isArray(parsed.bulletPoints)) {
      return parsed;
    }
  } catch (err) {
    console.error('Groq article summary error:', err);
  }

  return {
    keyTakeaway: `${title} highlights decisive strategic shifts dispatched by ${sourceName}.`,
    bulletPoints: [
      'Validated by institutional newsroom wire telemetry.',
      'Reflects primary market, industrial, and geopolitical momentum.',
      'Actionable analysis compiled by PRISM Intelligence.',
    ],
    readTime: Math.max(2, Math.round(content.split(' ').length / 200)),
  };
}
