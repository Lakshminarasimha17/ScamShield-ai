import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { securityHeaders } from './middleware/security.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import analyzeRouter from './routes/analyze.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or project root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Trust reverse proxy (Render, etc.) for accurate rate limiting
app.set('trust proxy', 1);

// Security
app.use(securityHeaders());
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : '*' }));

// Body parsing with size limits
app.use(express.json({ limit: '50kb' }));

// API routes
app.use('/api/analyze', apiLimiter, analyzeRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Unknown API routes return 404 JSON
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve React frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const indexHtml = path.join(clientDist, 'index.html');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
    } else {
      res.status(404).json({ error: 'Frontend build not found' });
    }
  });
}

app.listen(PORT, () => {
  console.log(`ScamShield API running on port ${PORT}`);
});

export default app;

