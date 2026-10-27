const express = require('express');

const {
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds
} = require('./metrics');

const app = express();

app.use(express.json());

// Middleware para coletar métricas HTTP
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    // Não contabiliza o próprio scraping do Prometheus
    if (req.path === '/metrics') {
      return;
    }

    const duration = Number(process.hrtime.bigint() - start) / 1e9;

    const route = req.route?.path || req.path;

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode)
    };

    httpRequestsTotal.inc(labels);

    httpRequestDurationSeconds.observe(labels, duration);
  });

  next();
});

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

// Endpoint utilizado pelo Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
});

module.exports = app;
