import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { setAuthToken, authApi } from "../api/authApi";
import { RootStackParamList } from "../App";
import { colors, textStyles, containerStyles , buttonStyles } from '../styles/themeStyles'

 type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userData = { username: "testUser", password: "1234" };
      const response = await authApi.login(userData);

      if (response.status === 200) {
        setAuthToken(response.data.token);
        navigation.navigate("Home");
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry // Hide the entered text
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  headline: {
    fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  button: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  }
});

export default LoginScreen;
