import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CaptureScreen from './screens/CaptureScreen';
import OutboxScreen from './screens/OutboxScreen';
import SettingsScreen from './screens/SettingsScreen';
import { StatusBar } from 'expo-status-bar';
import { initDB } from './lib/outboxStore';


export type RootStackParamList = {
  Capture: undefined;
  Outbox: undefined;
  Settings: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
  useEffect(() => {
    // Initialize database on app start
    try {
      initDB();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Capture">
        <Stack.Screen name="Capture" component={CaptureScreen} options={{ title: 'QuickTask' }} />
        <Stack.Screen name="Outbox" component={OutboxScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

