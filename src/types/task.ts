/**
 * Task type definition
 * Matches the backend Task model
 */
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task status options
 */
export const TASK_STATUSES = ['todo', 'in-progress', 'completed'] as const;

export type TaskStatus = typeof TASK_STATUSES[number];

