# VSKimi K2 - Advanced AI Agent Powered by Kimi K2

An advanced AI-powered coding agent that works like **Cursor** but with enhanced capabilities, built entirely with Docker. Leverages the powerful **Kimi K2** model from Moonshot AI via OpenRouter API.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Docker](https://img.shields.io/badge/Docker-20.10+-blue)
![Node](https://img.shields.io/badge/Node.js-20+-green)

---

## 🚀 Features

- **🤖 AI-Powered Chat**: Interactive conversation with Kimi K2 AI model
- **📋 Intelligent Planning**: Break down complex objectives into actionable tasks
- **⚙️ Task Execution**: Execute tasks with context awareness
- **🔍 Code Analysis**: Analyze and provide insights on code
- **✨ Code Refactoring**: Automatically refactor and improve code
- **💬 Conversation Memory**: Maintain conversation history for context
- **🐳 Full Docker Setup**: Ready-to-deploy containerized application
- **⚡ REST API**: Complete API for integration with other tools
- **🔒 Secure**: Environment variable-based configuration, no API keys in code

---

## 📋 Prerequisites

- **Docker** 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ (included with Docker Desktop)
- **OpenRouter API Key** ([Get one here](https://openrouter.ai))

### For Local Development (Optional)
- **Node.js** 20.x+ ([Install Node.js](https://nodejs.org/))
- **npm** 10.x+ or **yarn** 4.x+

---

## 🎯 Quick Start (Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/VSKimi/VSKimi-K2.git
cd VSKimi-K2
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
nano .env  # or use your editor
```

Add your API key:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=moonshotai/kimi-k2:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### 3. Start the Application
```bash
docker-compose up -d
```

### 4. Verify it's Running
```bash
# Check health
curl http://localhost:3000/health

# Check status
curl http://localhost:3000/api/status
```

---

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Running in Docker During Development
```bash
docker-compose up --build
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. **Chat with Agent**
```
POST /api/chat
```

**Request**:
```json
{
  "message": "How do I implement authentication in Node.js?"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "content": "Here's how to implement authentication...",
    "executionTime": 1234,
    "tokensUsed": {
      "input": 150,
      "output": 450
    }
  }
}
```

---

#### 2. **Create a Plan**
```
POST /api/plan
```

**Request**:
```json
{
  "objective": "Build a REST API with authentication",
  "context": "Using Node.js and Express"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "Build a REST API with authentication",
    "description": "Detailed plan...",
    "tasks": [
      {
        "id": "task-id",
        "description": "Set up Express server",
        "status": "pending",
        "priority": "high"
      }
    ],
    "createdAt": "2024-11-14T10:30:00Z",
    "updatedAt": "2024-11-14T10:30:00Z"
  }
}
```

---

#### 3. **Execute a Task**
```
POST /api/execute-task
```

**Request**:
```json
{
  "task": {
    "id": "task-id",
    "description": "Set up Express server with middleware",
    "status": "pending"
  },
  "context": "Project uses TypeScript and Docker"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "taskId": "task-id",
    "result": "Here's a complete Express server setup...",
    "status": "completed"
  }
}
```

---

#### 4. **Analyze & Refactor Code**
```
POST /api/analyze
```

**Request**:
```json
{
  "code": "function test(x) { return x + 1; }",
  "instructions": "Add TypeScript types and improve readability"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "analysis": "Current analysis...",
    "refactored": "function test(x: number): number { return x + 1; }"
  }
}
```

---

#### 5. **Get Conversation History**
```
GET /api/history
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    },
    {
      "role": "assistant",
      "content": "I'm doing great! How can I help?"
    }
  ]
}
```

---

#### 6. **Clear Conversation History**
```
POST /api/clear-history
```

**Response**:
```json
{
  "success": true,
  "message": "Conversation history cleared"
}
```

---

#### 7. **Get Server Status**
```
GET /api/status
```

**Response**:
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "model": "moonshotai/kimi-k2:free",
    "environment": "production",
    "uptime": 3600,
    "timestamp": "2024-11-14T10:30:00Z"
  }
}
```

---

#### 8. **Health Check**
```
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-11-14T10:30:00Z",
  "uptime": 3600
}
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENROUTER_API_KEY` | ✅ | - | Your OpenRouter API key |
| `OPENROUTER_MODEL` | ❌ | `moonshotai/kimi-k2:free` | AI model to use |
| `OPENROUTER_BASE_URL` | ❌ | `https://openrouter.ai/api/v1` | OpenRouter API base URL |
| `NODE_ENV` | ❌ | `development` | Node environment |
| `PORT` | ❌ | `3000` | Server port |
| `DEBUG` | ❌ | `false` | Enable debug logging |

---

## 📁 Project Structure

```
VSKimi-K2/
├── src/
│   ├── api/
│   │   └── openrouter.ts          # OpenRouter API client
│   ├── agent/
│   │   └── agent.ts               # AI Agent implementation
│   ├── types/
│   │   └── index.ts               # TypeScript definitions
│   ├── utils/                     # Utility functions
│   └── index.ts                   # Express server
├── docker/
│   └── (docker configs)
├── Dockerfile                     # Production image
├── docker-compose.yml             # Multi-container setup
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── .env.example                   # Env template
├── .gitignore                     # Git rules
├── .dockerignore                  # Docker rules
├── README.md                      # This file
└── todo.md                        # Project roadmap
```

---

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f vskim-k2-agent
```

### Rebuild Images
```bash
docker-compose up --build -d
```

### Run Commands in Container
```bash
docker-compose exec vskim-k2-agent npm run build
```

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Run Linter
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

---

## 📈 Performance Tips

1. **Use caching**: Enable Redis in docker-compose.yml for response caching
2. **Optimize token usage**: Keep conversations focused to reduce token consumption
3. **Clear history**: Use `/api/clear-history` periodically for long sessions
4. **Batch operations**: Group related tasks for better efficiency

---

## 🔒 Security Considerations

- ✅ API keys stored in `.env`, never committed
- ✅ Non-root user in Docker container
- ✅ Health checks for container monitoring
- ✅ Input validation on all endpoints
- ✅ Error messages don't leak sensitive info
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for public deployments
- ⚠️ Use strong API keys

---

## 🚀 Deployment

### Deploy with Docker Hub
```bash
docker build -t vskim-k2:latest .
docker tag vskim-k2:latest yourname/vskim-k2:latest
docker push yourname/vskim-k2:latest
```

### Deploy on Cloud (Example: AWS ECS)
```bash
# Use docker-compose to generate ECS task definition
docker-compose config > ecs-task-definition.json
```

### Environment Variables in Production
Set these securely:
- Use AWS Secrets Manager, HashiCorp Vault, or similar
- Never hardcode in Dockerfile or docker-compose
- Use `.env.production` with restricted permissions

---

## 🐛 Troubleshooting

### "Cannot connect to API"
```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs vskim-k2-agent

# Verify network
docker network ls
```

### "API Key Error"
```bash
# Verify .env file exists
cat .env

# Check if key is valid
curl -H "Authorization: Bearer YOUR_KEY" https://openrouter.ai/api/v1/models
```

### "Out of memory"
```bash
# Increase Docker memory limit in docker-compose.yml
# or Docker Desktop settings
```

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/VSKimi/VSKimi-K2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/VSKimi/VSKimi-K2/discussions)
- **Email**: support@vskim.dev

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Built with [Kimi K2](https://platform.moonshot.cn/) by Moonshot AI
- API powered by [OpenRouter](https://openrouter.ai/)
- Inspired by [Cursor](https://cursor.com/)

---

## 🗺️ Roadmap

See [todo.md](todo.md) for detailed roadmap and project status.

**v1.0** ✅ Core API & Agent
**v1.1** 🔄 VSCode Extension
**v1.2** 🔄 Multi-model Support
**v2.0** 📅 Web Dashboard & Team Collaboration

---

**Last Updated**: 2024-11-14
**Current Version**: 1.0.0-alpha

Happy coding! 🚀
