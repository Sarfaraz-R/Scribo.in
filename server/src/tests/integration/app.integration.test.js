import request from 'supertest';
import app from '../../app.js';
import { redisConnection } from '../../config/Redis.config.js';
import { submissionQueue } from '../../queues.js/submission.queue.js';

describe('Backend baseline integration', () => {
  afterAll(async () => {
    await submissionQueue.close();
    await redisConnection.quit();
  });

  it('returns health check', async () => {
    const res = await request(app).get('/api/healthcheck');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects malformed register payload', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'bad-email-format',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
  });

  it('rejects submission callback without worker secret', async () => {
    const res = await request(app)
      .post('/api/submissions/callback/results')
      .send({});

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects protected user route without token', async () => {
    const res = await request(app).get('/api/user/current-user');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns route-not-found via centralized error middleware', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
