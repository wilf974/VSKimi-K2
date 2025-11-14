import axios, { AxiosInstance } from 'axios';
import {
  OpenRouterRequest,
  OpenRouterResponse,
  OpenRouterMessage
} from '../types/index.js';

export class OpenRouterClient {
  private client: AxiosInstance;
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey: string, model: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = baseUrl;

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/VSKimi/VSKimi-K2',
        'X-Title': 'VSKimi K2 Agent',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 429) {
          console.error('Rate limited by OpenRouter API');
        } else if (error.response?.status === 401) {
          console.error('Invalid API key');
        }
        return Promise.reject(error);
      }
    );
  }

  async chat(messages: OpenRouterMessage[], options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  }): Promise<OpenRouterResponse> {
    try {
      const request: OpenRouterRequest = {
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 2000,
        top_p: options?.top_p ?? 0.9,
      };

      const response = await this.client.post<OpenRouterResponse>(
        '/chat/completions',
        request
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `OpenRouter API Error: ${error.response?.status} - ${error.response?.data}`
        );
      }
      throw error;
    }
  }

  async createPlan(objective: string, context?: string): Promise<string> {
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: `You are an expert AI planning agent. Create detailed, actionable plans to achieve objectives.
Always structure your response as:
1. Goal Analysis
2. Key Steps
3. Dependencies
4. Success Criteria

Be concise and practical.`,
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Create a detailed plan for: ${objective}${context ? `\n\nContext: ${context}` : ''}`,
    };

    const response = await this.chat([systemMessage, userMessage], {
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
  }

  async executeTask(task: string, context?: string): Promise<string> {
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: `You are an expert AI assistant capable of executing tasks, writing code, analyzing data, and solving problems.
Provide practical, working solutions. Include code examples when appropriate.`,
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Execute this task: ${task}${context ? `\n\nContext: ${context}` : ''}`,
    };

    const response = await this.chat([systemMessage, userMessage], {
      max_tokens: 3000,
    });

    return response.choices[0].message.content;
  }

  async analyzeCode(code: string, question: string): Promise<string> {
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: `You are an expert code analyst. Analyze code and provide insights, improvements, and answers to specific questions.`,
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Please analyze this code and answer: ${question}\n\nCode:\n\`\`\`\n${code}\n\`\`\``,
    };

    const response = await this.chat([systemMessage, userMessage], {
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
  }

  async refactorCode(code: string, requirements?: string): Promise<string> {
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: `You are an expert code refactoring specialist. Improve code quality, readability, and performance.
Always provide complete, working code.`,
    };

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: `Please refactor this code${requirements ? ` with these requirements: ${requirements}` : ''}:\n\n\`\`\`\n${code}\n\`\`\``,
    };

    const response = await this.chat([systemMessage, userMessage], {
      max_tokens: 3000,
    });

    return response.choices[0].message.content;
  }

  getUsage(): { inputTokens: number; outputTokens: number } {
    return {
      inputTokens: 0,
      outputTokens: 0,
    };
  }
}

export default OpenRouterClient;
