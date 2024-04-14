import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { setAuthToken, authApi } from "../api/authApi";
import { RootStackParamList } from "../App";
import { colors } from "../styles/themeStyles";
import Checkbox from "expo-checkbox";
import Icon from "react-native-vector-icons/FontAwesome";

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
        setAuthToken(response.data.accessToken, response.data.refreshToken);
        navigation.navigate("Home");
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    // Logic to handle forgot password action
    Alert.alert("Reset Password", "Reset password link sent to your email.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/PixelPalslogo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.headline}>Login</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={22} color={colors.background} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          placeholderTextColor={colors.textPrimary}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={22} color={colors.background} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholderTextColor={colors.textPrimary}
        />
      </View>
      <View style={styles.ForgotPasswordContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color={colors.background} />
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
          color={colors.grey}
        />
        <Icon.Button
          name="google"
          backgroundColor="#DB4437"
          style={styles.button}
        >
          <Text style={styles.text}>Login with Google</Text>
        </Icon.Button>
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
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 125,
  },
  icon: {
    padding: 10,
  },
  headline: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.background,
    marginBottom: 40,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    color: colors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderBottomWidth: 2,
    borderBottomColor: colors.background,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "80%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 20,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: "Roboto",
    marginLeft: 8,
  },
  ForgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "80%",
    marginBottom: 20,
    marginTop: -10,
    opacity: 0.8,
  },
  forgotPasswordText: {
    color: colors.background,
    fontSize: 12, 
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
    color: "#ffffff", // Ensures text is easily readable on the button
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    opacity: 0.8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#FFFFFF",

  },
  dividerText: {
    width: 50,
    textAlign: "center",
    color: "#FFFFFF",
  },
});

export default LoginScreen;
