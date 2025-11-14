import { v4 as uuidv4 } from 'crypto';
import OpenRouterClient from '../api/openrouter.js';
import {
  AgentTask,
  AgentPlan,
  AgentResponse,
  OpenRouterMessage
} from '../types/index.js';

export class Agent {
  private openRouter: OpenRouterClient;
  private conversationHistory: OpenRouterMessage[] = [];
  private maxHistory: number = 20;

  constructor(openRouterClient: OpenRouterClient) {
    this.openRouter = openRouterClient;
  }

  async createPlan(objective: string, context?: string): Promise<AgentPlan> {
    const startTime = performance.now();

    const planContent = await this.openRouter.createPlan(objective, context);

    const tasks = this.parsePlanToTasks(planContent);

    const plan: AgentPlan = {
      id: uuidv4(),
      title: objective,
      description: planContent,
      tasks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const endTime = performance.now();
    console.log(`Plan created in ${endTime - startTime}ms`);

    return plan;
  }

  async executeTask(task: AgentTask, context?: string): Promise<string> {
    try {
      task.status = 'in_progress';

      const result = await this.openRouter.executeTask(task.description, context);

      task.status = 'completed';
      return result;
    } catch (error) {
      task.status = 'failed';
      throw error;
    }
  }

  async chat(userMessage: string): Promise<AgentResponse> {
    const startTime = performance.now();

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Maintain conversation history size
    if (this.conversationHistory.length > this.maxHistory) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistory);
    }

    try {
      const response = await this.openRouter.chat(
        [
          {
            role: 'system',
            content: `You are VSKimi K2, an advanced AI coding assistant similar to Cursor but more capable.
You help with:
- Code generation and refactoring
- Problem solving and debugging
- Planning and task breakdown
- Code analysis and optimization
- Best practices and architecture guidance

Be concise, practical, and always provide working solutions.`,
          },
          ...this.conversationHistory,
        ],
        { max_tokens: 2000 }
      );

      const assistantMessage = response.choices[0].message.content;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      const endTime = performance.now();

      return {
        id: uuidv4(),
        content: assistantMessage,
        executionTime: endTime - startTime,
        tokensUsed: {
          input: response.usage.prompt_tokens,
          output: response.usage.completion_tokens,
        },
      };
    } catch (error) {
      console.error('Agent chat error:', error);
      throw error;
    }
  }

  async analyzeAndRefactor(code: string, instructions?: string): Promise<{
    analysis: string;
    refactored: string;
  }> {
    try {
      const analysis = await this.openRouter.analyzeCode(code, 'Provide a thorough analysis');
      const refactored = await this.openRouter.refactorCode(code, instructions);

      return { analysis, refactored };
    } catch (error) {
      console.error('Analysis and refactoring error:', error);
      throw error;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): OpenRouterMessage[] {
    return [...this.conversationHistory];
  }

  private parsePlanToTasks(planContent: string): AgentTask[] {
    const tasks: AgentTask[] = [];
    const lines = planContent.split('\n');
    let taskCounter = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && /^\d+\./.test(trimmed)) {
        taskCounter++;
        tasks.push({
          id: uuidv4(),
          description: trimmed.replace(/^\d+\.\s*/, ''),
          status: 'pending',
          priority: taskCounter <= 3 ? 'high' : taskCounter <= 6 ? 'medium' : 'low',
        });
      }
    }

    return tasks;
  }
}

export default Agent;
