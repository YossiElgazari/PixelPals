import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import LoginScreen from "./app/screens/loginScreen";
import RegisterScreen from "./app/screens/registerScreen";
import BottomTabNavigator from "./app/components/bottomTabNavigator";
import { colors } from "./app/styles/themeStyles";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import ResetPasswordScreen from "./app/screens/resetPasswordScreen";
import EditProfileScreen from "./app/screens/editProfileScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Explore: undefined;
  Search: undefined;
  AddPost: undefined;
  ResetPassword: undefined;
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
       <ActionSheetProvider>
      <Layout></Layout>
      </ActionSheetProvider>
    </AuthProvider>
  );
};

export const Layout = () => {
  const { authState } = useAuth();
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.background80} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authState?.authenticated ? (
          <>
          <Stack.Screen name="Home" component={BottomTabNavigator} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
