import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onStatusChange: (taskId: string, status: 'todo' | 'in-progress' | 'completed') => void;
  onReorder: (reorderedTasks: Task[]) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

/**
 * TaskList Component
 * Displays a draggable list of tasks with drag-and-drop reordering
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  onStatusChange,
  onReorder,
  isLoading = false,
  onRefresh,
  isRefreshing = false,
}) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Update local tasks when prop changes
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  /**
   * Handle drag end - reorder tasks
   */
  const handleDragEnd = useCallback(
    ({ data }: { data: Task[] }) => {
      // Update order values based on new positions
      const reorderedTasks = data.map((task, index) => ({
        ...task,
        order: index,
      }));

      setLocalTasks(reorderedTasks);
      onReorder(reorderedTasks);
    },
    [onReorder]
  );

  /**
   * Render individual task item
   */
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Task>) => {
      return (
        <ScaleDecorator>
          <View
            style={[
              styles.itemContainer,
              isActive && styles.itemActive,
            ]}
          >
            <TaskCard
              task={item}
              onPress={() => onTaskPress(item)}
              onStatusChange={(status) => onStatusChange(item._id, status)}
            />
            <View style={styles.dragHandle}>
              <Text style={styles.dragHandleText}>☰</Text>
            </View>
          </View>
        </ScaleDecorator>
      );
    },
    [onTaskPress, onStatusChange]
  );

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#42A5F5" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No tasks yet</Text>
        <Text style={styles.emptySubtext}>Create your first task to get started!</Text>
      </View>
    );
  }

  return (
    <DraggableFlatList
      data={localTasks}
      onDragEnd={handleDragEnd}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#42A5F5']}
            tintColor="#42A5F5"
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemActive: {
    opacity: 0.8,
    transform: [{ scale: 1.02 }],
  },
  dragHandle: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandleText: {
    fontSize: 20,
    color: '#9E9E9E',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

