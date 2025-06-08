import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ProjectLayout() {
  return (
  <>
    <Stack
      screenOptions={{ headerShown:false }}>
      <Stack.Screen name="buildloadscreen" />
      <Stack.Screen name="buildscreen" />
      <Stack.Screen name="chatscreen" />
      <Stack.Screen name="homeprojectscreen" />
    </Stack>
    <StatusBar style='auto'/>
  </>
  );
}
