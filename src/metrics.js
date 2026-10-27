const {
  register,
  collectDefaultMetrics,
  Counter,
  Histogram
} = require('@prometheus-io/client');

// Coleta métricas padrão do processo Node.js:
// CPU, memória, event loop, garbage collection etc.
collectDefaultMetrics();

// Total de requisições HTTP
const httpRequestsTotal = new Counter({
  name: 'devops_node_api_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Tempo de resposta das requisições
const httpRequestDurationSeconds = new Histogram({
  name: 'devops_node_api_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds
};
