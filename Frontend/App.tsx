import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './views/onboardingScreen';
import LoginScreen from './views/loginScreen';
import RegisterScreen from './views/registerScreen';
import BottomTabNavigator from './components/bottomTabNavigator'; 
import { StatusBar } from 'react-native';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Explore: undefined;
  Search: undefined;
  AddPost: undefined;
};

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('onboardingCompleted').then(value => {
      if (value !== null) {
        setIsOnboardingCompleted(true);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isOnboardingCompleted ? (
          // If onboarding is completed, proceed to Login or other initial route
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={BottomTabNavigator} />
          </>
        ) : (
          // If onboarding is not completed, show the Onboarding screen
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
};

export default App;