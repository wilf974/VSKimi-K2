// OpenRouter API Types
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: OpenRouterMessage;
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

// Agent Types
export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority?: 'low' | 'medium' | 'high';
  context?: Record<string, unknown>;
}

export interface AgentPlan {
  id: string;
  title: string;
  description: string;
  tasks: AgentTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentResponse {
  id: string;
  content: string;
  plan?: AgentPlan;
  tasks?: AgentTask[];
  executionTime: number;
  tokensUsed: {
    input: number;
    output: number;
  };
}

// Configuration Types
export interface AppConfig {
  nodeEnv: string;
  port: number;
  debug: boolean;
  openRouter: {
    apiKey: string;
    model: string;
    baseUrl: string;
  };
}
