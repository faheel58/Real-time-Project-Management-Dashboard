import { io, Socket } from 'socket.io-client';
import { Task } from '../types/task';

/**
 * Socket.io service for real-time communication
 * Handles connection, events, and reconnection logic
 */

// Socket.io server URL - adjust this to match your backend server
const SOCKET_URL = __DEV__ 
  ? 'http://localhost:3001'  // Development
  : 'https://your-production-server.com';  // Production

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to the Socket.io server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    this.setupEventListeners();
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
    });
  }

  /**
   * Disconnect from the Socket.io server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Socket disconnected');
    }
  }

  /**
   * Check if socket is connected
   */
  get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get the socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Listen to a socket event
   * @param event - Event name
   * @param callback - Callback function
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove a socket event listener
   * @param event - Event name
   * @param callback - Callback function (optional)
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Emit a socket event
   * @param event - Event name
   * @param data - Data to send
   */
  emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  /**
   * Create a new task via socket
   * @param taskData - Task data
   */
  createTask(taskData: { title: string; description?: string; status?: string; order?: number }): void {
    this.emit('createTask', taskData);
  }

  /**
   * Update a task via socket
   * @param taskData - Task data with id
   */
  updateTask(taskData: { id: string; title?: string; description?: string; status?: string; order?: number }): void {
    this.emit('updateTask', taskData);
  }

  /**
   * Reorder tasks via socket
   * @param tasks - Array of tasks with id and order
   */
  reorderTasks(tasks: Array<{ id: string; order: number }>): void {
    this.emit('reorderTasks', { tasks });
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;

