import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Free Gemini models in priority order
const FREE_GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Rich fallback intelligence if network or API is temporarily unreachable
const DEFAULT_FALLBACK_INSIGHTS: Record<string, any> = {
  default: {
    summary: 'This prediction market balances strong technical/competitive momentum against structural deployment and regulatory timelines.',
    bullCase: [
      'Strong organizational momentum and rapid technological/strategic execution heading into the cutoff date.',
      'Favorable industry interest and accelerated milestone verification reported across accredited testing bodies.'
    ],
    bearCase: [
      'Strict regulatory certifications, safety audits, and potential supply-chain bottlenecks before year-end.',
      'High historical variance and external friction points that could delay final qualification.'
    ],
    watchpoints: [
      'Upcoming independent verification filings and quarterly progress audits.',
      'Public declarations from governing authorities or sanctioning bodies.'
    ],
    contractNuance: 'Contract settles strictly on accredited public records before the cutoff; unverified claims or internal milestones do not count.',
    yesWinsIf: 'Verified settlement conditions are officially satisfied on or before the contract deadline.',
    noWinsIf: 'Criteria are not satisfied by the deadline, or qualifying proceedings are formally cancelled.',
    source: 'offline-intelligence',
  }
};

app.post('/api/explain-prediction', async (req, res) => {
  try {
    const { question, description, resolutionRule, category, odds, shortName } = req.body;

    if (!question || !resolutionRule) {
      return res.status(400).json({ error: 'Missing question or resolution rule.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      console.warn('GEMINI_API_KEY not found in environment, providing fallback explanation.');
      return res.json({
        ...DEFAULT_FALLBACK_INSIGHTS.default,
        yesWinsIf: 'Verified criteria specified in the resolution rules are met before the deadline.',
        noWinsIf: 'Conditions are not met, the deadline passes without resolution, or qualifying events are cancelled.',
        source: 'fallback',
        model: 'offline-rule-parser',
      });
    }

    const prompt = `You are a senior quantitative prediction market research analyst.
Provide an objective, high-value market intelligence report for the following prediction market:

Market Question: ${question}
Short Name: ${shortName || ''}
Category: ${category || 'General'}
Market Context: ${description || ''}
Current Odds: ${odds || 'Market active'}
Settlement Rule: ${resolutionRule}

Your task:
Do NOT just rephrase the rules. Provide genuine, actionable market intelligence that highlights Gemini's analytical capabilities:
1. "summary": 1-2 sentence executive market briefing highlighting what is at stake and the underlying market dynamic/sentiment.
2. "bullCase": Array of 2 concrete, realistic catalysts / analytical arguments that favor YES (e.g. technological scaling, OEM pilots, squad form, regulatory tailwinds).
3. "bearCase": Array of 2 concrete, realistic headwinds / risks that favor NO (e.g. supply bottlenecks, safety certification hurdles, benchmark saturation, tournament volatility).
4. "watchpoints": Array of 2 specific upcoming milestones, events, or metrics traders should monitor before resolution.
5. "contractNuance": 1 crucial technicality, trap, or edge case in the settlement wording that traders must not overlook (e.g. public leaderboard vs private tests, regulation time vs shootouts, commercial vs test flights).
6. "yesWinsIf": 1 clear sentence on the exact condition that makes YES win.
7. "noWinsIf": 1 clear sentence on the exact condition that makes NO win.

STRICT CONSTRAINTS:
- Do NOT take a side, give financial advice, or recommend betting YES or NO.
- Keep each bullet punchy, insightful, and accessible.
- Maintain a professional, objective financial analyst tone.

Respond ONLY with a valid JSON object matching this structure:
{
  "summary": "...",
  "bullCase": ["...", "..."],
  "bearCase": ["...", "..."],
  "watchpoints": ["...", "..."],
  "contractNuance": "...",
  "yesWinsIf": "...",
  "noWinsIf": "..."
}`;

    let lastError: any = null;
    let successfulResult: any = null;

    // Call using free Gemini models with automatic cascade
    for (const modelName of FREE_GEMINI_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '';
        const parsed = JSON.parse(rawText);

        if (parsed.summary && parsed.bullCase && parsed.bearCase && parsed.watchpoints) {
          successfulResult = {
            summary: parsed.summary,
            bullCase: Array.isArray(parsed.bullCase) ? parsed.bullCase : [parsed.bullCase],
            bearCase: Array.isArray(parsed.bearCase) ? parsed.bearCase : [parsed.bearCase],
            watchpoints: Array.isArray(parsed.watchpoints) ? parsed.watchpoints : [parsed.watchpoints],
            contractNuance: parsed.contractNuance || 'Settlement requires verified public proof before the deadline.',
            yesWinsIf: (parsed.yesWinsIf || '').replace(/^YES wins if\s*[:—\.]?\s*/i, '').trim(),
            noWinsIf: (parsed.noWinsIf || '').replace(/^NO wins if\s*[:—\.]?\s*/i, '').trim(),
            model: modelName,
            source: 'gemini',
          };
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} call failed, trying next free model...`, err?.message || err);
      }
    }

    if (successfulResult) {
      return res.json(successfulResult);
    }

    console.warn('All free Gemini models returned an error, falling back:', lastError?.message);
    return res.json({
      ...DEFAULT_FALLBACK_INSIGHTS.default,
      source: 'fallback',
      model: 'offline-rule-parser',
    });
  } catch (error: any) {
    console.error('Gemini explanation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate explanation. Please try again.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
