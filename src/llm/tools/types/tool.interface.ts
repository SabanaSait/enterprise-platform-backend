import { MetricsResponse } from 'src/modules/dashboard/metrics/types/metrics.types';

export interface Tool<TArgs = unknown, TResult = unknown> {
  name: string;
  description: string;
  execute: (args?: TArgs) => Promise<TResult>;
}

export type MetricsResult = {
  success: boolean;
  data: MetricsResponse;
};

export const TOOLS_TOKEN = 'TOOLS';
