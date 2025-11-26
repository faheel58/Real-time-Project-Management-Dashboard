require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const taskRoutes = require('./routes/tasks');
const Task = require('./models/Task');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/tasks', taskRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  /**
   * Handle task creation
   * Event: createTask
   * Payload: { title, description?, status?, order? }
   */
  socket.on('createTask', async (taskData) => {
    try {
      const { title, description, status, order } = taskData;

      if (!title || title.trim() === '') {
        socket.emit('error', { message: 'Task title is required' });
        return;
      }

      // Get the maximum order value
      const maxOrderTask = await Task.findOne().sort({ order: -1 });
      const defaultOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

      const task = new Task({
        title: title.trim(),
        description: description?.trim() || '',
        status: status || 'todo',
        order: order !== undefined ? order : defaultOrder
      });

      const savedTask = await task.save();

      // Broadcast to all clients (including sender)
      io.emit('taskCreated', savedTask);
      console.log(`📝 Task created via socket: ${savedTask._id}`);
    } catch (error) {
      console.error('Error creating task via socket:', error);
      socket.emit('error', { message: 'Failed to create task', error: error.message });
    }
  });

  /**
   * Handle task update
   * Event: updateTask
   * Payload: { id, title?, description?, status?, order? }
   */
  socket.on('updateTask', async (taskData) => {
    try {
      const { id, ...updateData } = taskData;

      if (!id) {
        socket.emit('error', { message: 'Task ID is required' });
        return;
      }

      const task = await Task.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).lean();

      if (!task) {
        socket.emit('error', { message: 'Task not found' });
        return;
      }

      // Broadcast to all clients (including sender)
      io.emit('taskUpdated', task);
      console.log(`✏️ Task updated via socket: ${id}`);
    } catch (error) {
      console.error('Error updating task via socket:', error);
      socket.emit('error', { message: 'Failed to update task', error: error.message });
    }
  });

  /**
   * Handle task reordering
   * Event: reorderTasks
   * Payload: { tasks: [{ id, order }, ...] }
   */
  socket.on('reorderTasks', async (data) => {
    try {
      const { tasks } = data;

      if (!Array.isArray(tasks) || tasks.length === 0) {
        socket.emit('error', { message: 'Tasks array is required' });
        return;
      }

      // Update all tasks in parallel
      const updatePromises = tasks.map(({ id, order }) =>
        Task.findByIdAndUpdate(
          id,
          { order, updatedAt: Date.now() },
          { new: true, runValidators: true }
        )
      );

      const updatedTasks = await Promise.all(updatePromises);

      // Broadcast to all clients (including sender)
      io.emit('tasksReordered', updatedTasks);
      console.log(`🔄 Tasks reordered via socket: ${updatedTasks.length} tasks`);
    } catch (error) {
      console.error('Error reordering tasks via socket:', error);
      socket.emit('error', { message: 'Failed to reorder tasks', error: error.message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-management';
connectDB(MONGODB_URI);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };

