import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
  <>
    <Stack
      screenOptions={{ headerShown:false }}>
      <Stack.Screen name="EmailScreen" />
      <Stack.Screen name="PinCodeScreen" />
    </Stack>
    <StatusBar style='auto'/>
  </>
    
  );
}
