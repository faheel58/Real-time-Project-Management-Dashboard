import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { TaskList } from '../components/TaskList';
import { Task } from '../types/task';
import { fetchTasks, createTask } from '../services/api';
import socketService from '../services/socket';

/**
 * Dashboard Screen
 * Main screen displaying tasks with real-time updates
 */
export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  /**
   * Load tasks from API
   */
  const loadTasks = useCallback(async () => {
    try {
      const fetchedTasks = await fetchTasks();
      // Sort by order, then by createdAt
      const sortedTasks = fetchedTasks.sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  /**
   * Initialize socket connection and set up event listeners
   */
  useEffect(() => {
    // Connect to socket
    socketService.connect();

    // Set up socket event listeners
    const handleTaskCreated = (task: Task) => {
      console.log('Task created via socket:', task);
      setTasks((prevTasks) => {
        const exists = prevTasks.find((t) => t._id === task._id);
        if (exists) return prevTasks;
        return [...prevTasks, task].sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      });
    };

    const handleTaskUpdated = (task: Task) => {
      console.log('Task updated via socket:', task);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? task : t))
      );
    };

    const handleTasksReordered = (reorderedTasks: Task[]) => {
      console.log('Tasks reordered via socket:', reorderedTasks);
      setTasks(reorderedTasks);
    };

    const handleError = (error: { message: string }) => {
      console.error('Socket error:', error);
      Alert.alert('Error', error.message || 'An error occurred');
    };

    socketService.on('taskCreated', handleTaskCreated);
    socketService.on('taskUpdated', handleTaskUpdated);
    socketService.on('tasksReordered', handleTasksReordered);
    socketService.on('error', handleError);

    // Load initial tasks
    loadTasks();

    // Cleanup on unmount
    return () => {
      socketService.off('taskCreated', handleTaskCreated);
      socketService.off('taskUpdated', handleTaskUpdated);
      socketService.off('tasksReordered', handleTasksReordered);
      socketService.off('error', handleError);
      socketService.disconnect();
    };
  }, [loadTasks]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadTasks();
  }, [loadTasks]);

  /**
   * Handle task press - show task details
   */
  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    // You can implement a detail modal or navigation here
    Alert.alert(
      task.title,
      task.description || 'No description',
      [{ text: 'OK' }]
    );
  }, []);

  /**
   * Handle status change
   */
  const handleStatusChange = useCallback(
    (taskId: string, status: 'todo' | 'in-progress' | 'completed') => {
      // Update via socket for real-time sync
      socketService.updateTask({ id: taskId, status });
    },
    []
  );

  /**
   * Handle task reorder
   */
  const handleReorder = useCallback((reorderedTasks: Task[]) => {
    // Update via socket for real-time sync
    const tasksToReorder = reorderedTasks.map((task) => ({
      id: task._id,
      order: task.order,
    }));
    socketService.reorderTasks(tasksToReorder);
  }, []);

  /**
   * Handle create task
   */
  const handleCreateTask = useCallback(async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setIsCreating(true);

    try {
      // Create via socket for real-time sync
      socketService.createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
      });

      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }, [newTaskTitle, newTaskDescription]);

  /**
   * Open create task modal
   */
  const openCreateModal = useCallback(() => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsModalVisible(true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Project Management</Text>
          <Text style={styles.headerSubtitle}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onTaskPress={handleTaskPress}
          onStatusChange={handleStatusChange}
          onReorder={handleReorder}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Create Task Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={openCreateModal}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Create Task Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>Create New Task</Text>

                <Text style={styles.inputLabel}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  autoFocus
                  maxLength={200}
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter task description (optional)"
                  value={newTaskDescription}
                  onChangeText={setNewTaskDescription}
                  multiline
                  numberOfLines={4}
                  maxLength={1000}
                  textAlignVertical="top"
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setIsModalVisible(false)}
                    disabled={isCreating}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.createButton]}
                    onPress={handleCreateTask}
                    disabled={isCreating || !newTaskTitle.trim()}
                  >
                    {isCreating ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.createButtonText}>Create</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#42A5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  createButton: {
    backgroundColor: '#42A5F5',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

