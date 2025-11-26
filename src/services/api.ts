import { Task } from '../types/task';

/**
 * API service for REST API calls
 * Handles all HTTP requests to the backend
 */

// Backend API URL - adjust this to match your backend server
const API_URL = __DEV__
  ? 'http://localhost:3001/api'  // Development - use your local IP for physical device
  : 'https://your-production-server.com/api';  // Production

/**
 * Fetch all tasks
 * @param status - Optional status filter
 */
export const fetchTasks = async (status?: string): Promise<Task[]> => {
  try {
    const url = status ? `${API_URL}/tasks?status=${status}` : `${API_URL}/tasks`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Create a new task
 * @param taskData - Task data
 */
export const createTask = async (taskData: {
  title: string;
  description?: string;
  status?: string;
  order?: number;
}): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param id - Task ID
 * @param taskData - Updated task data
 */
export const updateTask = async (
  id: string,
  taskData: {
    title?: string;
    description?: string;
    status?: string;
    order?: number;
  }
): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Reorder tasks
 * @param tasks - Array of tasks with id and order
 */
export const reorderTasks = async (
  tasks: Array<{ id: string; order: number }>
): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error reordering tasks:', error);
    throw error;
  }
};

/**
 * Delete a task
 * @param id - Task ID
 */
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

