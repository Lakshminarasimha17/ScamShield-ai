import { Router } from 'express';
import { analyzeSchema } from '../validation/schemas.js';
import { analyzeWithGemini } from '../services/geminiService.js';
import { fallbackAnalyze } from '../services/fallbackAnalyzer.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // Validate input
    const parseResult = analyzeSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((i) => i.message);
      return res.status(400).json({ error: 'Invalid input', details: errors });
    }

    const { message, type, language } = parseResult.data;

    let result;
    try {
      result = await analyzeWithGemini(message, type, language);
    } catch (err) {
      console.warn('Gemini API unavailable, using fallback analyzer:', err.message);
      result = fallbackAnalyze(message, language);
    }

    return res.json(result);
  } catch (err) {
    console.error('Analysis error:', err.message);
    return res.status(500).json({
      error: 'Analysis failed. Please try again later.',
    });
  }
});

export default router;

