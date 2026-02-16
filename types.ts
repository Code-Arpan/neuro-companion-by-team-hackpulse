
export interface TaskStep {
  id: string;
  description: string;
  isCompleted: boolean;
  estimatedMinutes: number;
}

export interface UserTask {
  id: string;
  originalGoal: string;
  steps: TaskStep[];
  createdAt: number;
  completedAt?: number;
}

export interface UserProfile {
  name: string;
  preferences: {
    useDyslexiaFont: boolean;
    highContrast: boolean;
    soundEnabled: boolean;
  };
  wins: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  ACTIVE_TASK = 'ACTIVE_TASK',
  SUCCESS = 'SUCCESS'
}
