import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onStatusChange: (status: 'todo' | 'in-progress' | 'completed') => void;
}

/**
 * TaskCard Component
 * Displays a single task with status indicator and action buttons
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onStatusChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return '#FFA726';
      case 'in-progress':
        return '#42A5F5';
      case 'completed':
        return '#66BB6A';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const statusColor = getStatusColor(task.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        <Text style={styles.statusText}>{getStatusLabel(task.status)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>

      {task.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.actions}>
        {task.status !== 'todo' && (
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#FFA726' }]}
            onPress={() => onStatusChange('todo')}
          >
            <Text style={styles.statusButtonText}>To Do</Text>
          </TouchableOpacity>
        )}
        {task.status !== 'in-progress' && (
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#42A5F5' }]}
            onPress={() => onStatusChange('in-progress')}
          >
            <Text style={styles.statusButtonText}>In Progress</Text>
          </TouchableOpacity>
        )}
        {task.status !== 'completed' && (
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#66BB6A' }]}
            onPress={() => onStatusChange('completed')}
          >
            <Text style={styles.statusButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

