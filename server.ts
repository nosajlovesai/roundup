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

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
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

app.post('/api/explain-prediction', async (req, res) => {
  try {
    const { question, description, resolutionRule } = req.body;

    if (!question || !resolutionRule) {
      return res.status(400).json({ error: 'Missing question or resolution rule.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        yesWinsIf: 'Verified criteria specified in the resolution rules are met before the deadline.',
        noWinsIf: 'Conditions are not met, the deadline passes without resolution, or qualifying events are cancelled.',
        source: 'fallback',
      });
    }

    const prompt = `You are a neutral prediction market clarity assistant explaining rules to a first-time prediction market user in plain, accessible language.
Explain the following market using ONLY the supplied question, description, and resolution rules.

Market Question: ${question}
Market Description: ${description || ''}
Resolution Rules: ${resolutionRule}

Your task:
1. Explain the resolution conditions to a beginner in plain language.
2. Return two short labeled parts:
   - "yesWinsIf": Explains what makes YES win, preserving any important exceptions from the supplied rules (e.g. cancellation clauses, official replay requirements, minimum speeds/counts, deadline dates).
   - "noWinsIf": Explains what makes NO win, including any explicit default or negative conditions and deadlines.
3. Keep each part concise (1-2 clear sentences each).

STRICT CONSTRAINTS:
- Do NOT invent current facts, real-world developments, or outside news.
- Do NOT predict the outcome or guess who is going to win.
- Do NOT recommend a side or give financial/betting advice.
- Do NOT mention or imply that Gemini generated the displayed market prices, odds, or percentages.
- Preserve all important exceptions and dates specified in the resolution rule.

Respond with a JSON object with this exact structure:
{
  "yesWinsIf": "Clear description of when YES wins and any key exceptions...",
  "noWinsIf": "Clear description of when NO wins and any key exceptions..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text?.trim() || '';

    try {
      const parsed = JSON.parse(rawText);
      const cleanYes = (parsed.yesWinsIf || '').replace(/^YES wins if\s*[:—\.]?\s*/i, '').trim();
      const cleanNo = (parsed.noWinsIf || '').replace(/^NO wins if\s*[:—\.]?\s*/i, '').trim();

      return res.json({
        yesWinsIf: cleanYes || 'The verified condition in the resolution rules is met before the deadline.',
        noWinsIf: cleanNo || 'The condition is not met by the deadline, or qualifying events are cancelled.',
      });
    } catch (parseErr) {
      console.warn('Could not parse Gemini JSON response, extracting lines:', rawText);
      return res.json({
        yesWinsIf: 'The verified condition in the resolution rules is met before the deadline.',
        noWinsIf: 'The condition is not met by the deadline, or qualifying events are cancelled.',
      });
    }
  } catch (error: any) {
    console.error('Gemini explanation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate explanation. Please try again.',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
