import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { setAuthToken, authApi } from "../api/authApi";
import { RootStackParamList } from "../App";
import { colors } from '../styles/themeStyles';

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
      <View style={styles.logoContainer}>
        <Image source={require('../assets/PixelPalslogo.png')} style={styles.logo} />
        <Text style={styles.headline}>Login</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        placeholderTextColor={colors.textPrimary}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholderTextColor={colors.textPrimary}
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color={colors.background} />
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
          color={colors.grey}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  headline: {
    fontSize: 44,
    fontWeight: 'bold',
    color: colors.background,
  },
  input: {
    width: "80%",
    height: 40,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    width: "30%",
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
  }
});

export default LoginScreen;
