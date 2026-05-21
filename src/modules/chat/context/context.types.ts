export interface CopilotContext {
  page?: string;
  userId?: string;
  filters?: Record<string, any>;
  selection?: Record<string, any>;
  metadata?: Record<string, any>;
}
