import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import analyzeRouter from '../routes/analyze.js';

function createTestApp() {
  const app = express();
  app.use(express.json({ limit: '50kb' }));
  app.use('/api/analyze', analyzeRouter);
  return app;
}

async function request(app, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      fetch(`http://localhost:${port}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(async (res) => {
          const data = await res.json();
          server.close();
          resolve({ status: res.status, data });
        })
        .catch((err) => {
          server.close();
          reject(err);
        });
    });
  });
}

describe('POST /api/analyze', () => {
  let app;

  before(() => {
    // Ensure no real API key so fallback is used
    delete process.env.GEMINI_API_KEY;
    app = createTestApp();
  });

  it('should reject empty body', async () => {
    const { status, data } = await request(app, {});
    assert.equal(status, 400);
    assert.ok(data.error);
  });

  it('should reject message shorter than 5 characters', async () => {
    const { status, data } = await request(app, { message: 'Hi' });
    assert.equal(status, 400);
    assert.ok(data.details.some((d) => d.includes('5 characters')));
  });

  it('should reject invalid message type', async () => {
    const { status, data } = await request(app, { message: 'This is a test message', type: 'invalid' });
    assert.equal(status, 400);
    assert.ok(data.error);
  });

  it('should use fallback analyzer when Gemini is unavailable', async () => {
    const { status, data } = await request(app, {
      message: 'Congratulations! You have won $1,000,000! Click here to claim your prize immediately: http://bit.ly/scam123. Send your bank account details now.',
      type: 'sms',
      language: 'en',
    });
    assert.equal(status, 200);
    assert.ok(['low', 'medium', 'high'].includes(data.risk_level));
    assert.equal(typeof data.risk_score, 'number');
    assert.ok(data.risk_score >= 0 && data.risk_score <= 100);
    assert.ok(Array.isArray(data.warning_signs));
    assert.ok(data.warning_signs.length > 0);
    assert.ok(typeof data.explanation === 'string');
    assert.ok(Array.isArray(data.recommendations));
    assert.equal(data.analysis_method, 'rule_based_fallback');
  });

  it('should detect high risk in scam messages', async () => {
    const { status, data } = await request(app, {
      message: 'URGENT: Your bank account has been suspended. Click http://bit.ly/fake to verify your identity. Send your credit card number and CVV immediately or your account will be permanently closed.',
      type: 'sms',
    });
    assert.equal(status, 200);
    assert.equal(data.risk_level, 'high');
    assert.ok(data.risk_score >= 60);
  });

  it('should give low risk to benign messages', async () => {
    const { status, data } = await request(app, {
      message: 'Hey, are we still meeting for coffee tomorrow at 3pm? Let me know if the time works for you.',
      type: 'sms',
    });
    assert.equal(status, 200);
    assert.equal(data.risk_level, 'low');
    assert.ok(data.risk_score < 30);
  });

  it('should handle Hindi language parameter', async () => {
    const { status, data } = await request(app, {
      message: 'Congratulations! You have won a prize. Click here immediately.',
      type: 'sms',
      language: 'hi',
    });
    assert.equal(status, 200);
    assert.ok(data.explanation);
    // Fallback should return Hindi text
  });

  it('should handle Telugu language parameter', async () => {
    const { status, data } = await request(app, {
      message: 'Congratulations! You have won a prize. Click here immediately.',
      type: 'sms',
      language: 'te',
    });
    assert.equal(status, 200);
    assert.ok(data.explanation);
  });

  it('should include disclaimer in response', async () => {
    const { status, data } = await request(app, {
      message: 'This is a normal looking message for testing purposes here.',
      type: 'other',
    });
    assert.equal(status, 200);
    assert.ok(data.disclaimer);
    assert.ok(data.disclaimer.length > 0);
  });
});

