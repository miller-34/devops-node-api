const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'DevOps Node API',
    version: '1.0.0',
    message: 'API running successfully'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    application: 'devops-node-api',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/api/projects', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'CI/CD Pipeline',
      technology: 'GitHub Actions'
    },
    {
      id: 2,
      name: 'Containerization',
      technology: 'Docker'
    },
    {
      id: 3,
      name: 'Container Orchestration',
      technology: 'Kubernetes'
    }
  ]);
});

module.exports = app;
