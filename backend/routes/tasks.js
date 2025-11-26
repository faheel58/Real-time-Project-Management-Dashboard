const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

/**
 * GET /api/tasks
 * Fetch all tasks, optionally filtered by status
 * Query params: ?status=todo|in-progress|completed
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const tasks = await Task.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
});

/**
 * GET /api/tasks/:id
 * Fetch a single task by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean();
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 * Body: { title, description?, status?, order? }
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, status, order } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // Get the maximum order value to set default order for new task
    const maxOrderTask = await Task.findOne().sort({ order: -1 });
    const defaultOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'todo',
      order: order !== undefined ? order : defaultOrder
    });

    const savedTask = await task.save();

    res.status(201).json({
      success: true,
      data: savedTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task
 * Body: { title?, description?, status?, order? }
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, order } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (order !== undefined) updateData.order = order;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
});

/**
 * PUT /api/tasks/reorder
 * Reorder multiple tasks at once
 * Body: { tasks: [{ id, order }, ...] }
 */
router.put('/reorder', async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tasks array is required'
      });
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

    res.json({
      success: true,
      data: updatedTasks,
      message: 'Tasks reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder tasks',
      error: error.message
    });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id).lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
});

module.exports = router;

