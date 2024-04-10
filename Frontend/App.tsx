import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './views/loginScreen';
import RegisterScreen from './views/registerScreen';
import BottomTabNavigator from './components/bottomTabNavigator'; 
import { StatusBar } from 'react-native';
import './utilities.css';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
