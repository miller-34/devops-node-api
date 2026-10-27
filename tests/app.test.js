const request = require('supertest');
const app = require('../src/app');

describe('DevOps Node API', () => {

  describe('GET /health', () => {
    it('should return HTTP 200 and healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/status', () => {
    it('should return application status', async () => {
      const response = await request(app).get('/api/status');

      expect(response.statusCode).toBe(200);
      expect(response.body.application).toBe('devops-node-api');
      expect(response.body.status).toBe('running');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('GET /api/projects', () => {
    it('should return the DevOps projects list', async () => {
      const response = await request(app).get('/api/projects');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

});
