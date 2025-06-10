import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ServicesLayout() {
  return (
  <>
    <Stack
      screenOptions={{ headerShown:false }}>
      <Stack.Screen name="ProjectDownloader" />
      <Stack.Screen name="ProjectService" />
    </Stack>
    <StatusBar style='auto'/>
  </>
  );
}
