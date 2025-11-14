import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import OpenRouterClient from './api/openrouter.js';
import Agent from './agent/agent.js';
import { AppConfig, AgentTask, AgentPlan } from './types/index.js';

// Load configuration
const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  debug: process.env.DEBUG === 'true',
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    model: process.env.OPENROUTER_MODEL || 'moonshotai/kimi-k2:free',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  },
};

// Validate configuration
if (!config.openRouter.apiKey) {
  console.error('FATAL: OPENROUTER_API_KEY environment variable is required');
  process.exit(1);
}

// Initialize Express app
const app: Express = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (config.debug) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Initialize OpenRouter client and Agent
const openRouterClient = new OpenRouterClient(
  config.openRouter.apiKey,
  config.openRouter.model,
  config.openRouter.baseUrl
);

const agent = new Agent(openRouterClient);

// Routes

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string' });
      return;
    }

    if (config.debug) console.log('Chat request:', message);

    const response = await agent.chat(message);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Planning endpoint
app.post('/api/plan', async (req: Request, res: Response) => {
  try {
    const { objective, context } = req.body;

    if (!objective || typeof objective !== 'string') {
      res.status(400).json({ error: 'Objective is required and must be a string' });
      return;
    }

    if (config.debug) console.log('Plan request:', objective);

    const plan = await agent.createPlan(objective, context);

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('Plan error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Task execution endpoint
app.post('/api/execute-task', async (req: Request, res: Response) => {
  try {
    const { task, context } = req.body as { task: AgentTask; context?: string };

    if (!task || !task.description) {
      res.status(400).json({ error: 'Task with description is required' });
      return;
    }

    if (config.debug) console.log('Execute task:', task.description);

    const result = await agent.executeTask(task, context);

    res.json({
      success: true,
      data: {
        taskId: task.id,
        result,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Task execution error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Code analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { code, instructions } = req.body;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Code is required and must be a string' });
      return;
    }

    if (config.debug) console.log('Analyze request');

    const result = await agent.analyzeAndRefactor(code, instructions);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Conversation history endpoint
app.get('/api/history', (req: Request, res: Response) => {
  try {
    const history = agent.getHistory();
    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Clear conversation history endpoint
app.post('/api/clear-history', (req: Request, res: Response) => {
  try {
    agent.clearHistory();
    res.json({
      success: true,
      message: 'Conversation history cleared',
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      model: config.openRouter.model,
      environment: config.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.path}`,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: config.debug ? err.message : undefined,
  });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║        VSKimi K2 Agent - Powered by Kimi K2            ║
╠════════════════════════════════════════════════════════╣
║  Server started on http://localhost:${config.port}                    ║
║  Model: ${config.openRouter.model.padEnd(38, ' ')}║
║  Environment: ${config.nodeEnv.padEnd(37, ' ')}║
║  Debug Mode: ${config.debug ? 'ON' : 'OFF'.padEnd(35, ' ')}║
╚════════════════════════════════════════════════════════╝
  `);

  console.log('Available endpoints:');
  console.log('  POST /api/chat          - Chat with the agent');
  console.log('  POST /api/plan          - Create a plan for an objective');
  console.log('  POST /api/execute-task  - Execute a specific task');
  console.log('  POST /api/analyze       - Analyze and refactor code');
  console.log('  GET  /api/history       - Get conversation history');
  console.log('  POST /api/clear-history - Clear conversation history');
  console.log('  GET  /api/status        - Get server status');
  console.log('  GET  /health            - Health check');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
