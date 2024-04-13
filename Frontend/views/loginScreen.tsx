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

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

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
      <View style={styles.rememberMeAndForgotPasswordContainer}>
        <View style={styles.rememberMeContainer}>
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? colors.background : undefined} // Use your theme primary color
          />
          <Text style={styles.label}>Remember me</Text>
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 125,
  },
  headline: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.background,
    marginBottom: 40,
  },
  input: {
    width: "80%",
    height: 40,
    borderBottomWidth: 2, // Set the width of the bottom border
    marginBottom: 20,
    paddingHorizontal: 10, // If you want no background, set this to 'transparent'
    color: colors.textPrimary,
    fontFamily: "Roboto",
    // Set the rest of the borders to 0 to only show the bottom line
    borderWidth: 0, // This removes border from all sides
    borderTopWidth: 0, // Redundant due to the above, but included for clarity
    borderLeftWidth: 0,
    borderRightWidth: 0,
    // Optionally set border color for the bottom border
    borderBottomColor: colors.background, // Use your theme color or any color for underline
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
  rememberMeAndForgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  forgotPasswordText: {
    color: colors.background, // Use a color that signifies an action or use the theme primary color
    // fontFamily: "Roboto", // Uncomment if you have this font set up
  },
});

export default LoginScreen;
