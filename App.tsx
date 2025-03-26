import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from './src/hooks/useAuth';

// Import screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import MedicationListScreen from './src/screens/medication/MedicationListScreen';
import MedicationDetailScreen from './src/screens/medication/MedicationDetailScreen';
import AddMedicationScreen from './src/screens/medication/AddMedicationScreen';

// Import our global CSS
import './global.css';

// Define the root stack navigator types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MedicationList: undefined;
  MedicationDetail: { medicationId: string };
  AddMedication: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4F6D7A',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Sign In' }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen
              name="MedicationList"
              component={MedicationListScreen}
              options={{ title: 'My Medications' }}
            />
            <Stack.Screen
              name="MedicationDetail"
              component={MedicationDetailScreen}
              options={{ title: 'Medication Details' }}
            />
            <Stack.Screen
              name="AddMedication"
              component={AddMedicationScreen}
              options={{ title: 'Add Medication' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <AuthProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
