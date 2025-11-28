import 'react-native-reanimated';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dashboard } from './src/screens/Dashboard';

/**
 * Main App Component
 * Entry point for the Real-Time Project Management Dashboard
 */
export default function App() {
  return (
    <>
      <Dashboard />
      <StatusBar style="auto" />
    </>
  );
}
