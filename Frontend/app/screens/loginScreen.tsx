import React, { useState, useContext } from "react";
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
import { RootStackParamList } from "../../App";
import { colors } from "../styles/themeStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/AuthContext";
import MyButton from "../components/myButton";
import LoadingSpinner from "../components/loading";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { onLogin } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const result = await onLogin!(username, password);
    navigation.navigate("Home");
    if (result && result.error) {
      console.log(result.msg);
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    Alert.alert("Reset Password", "Reset password link sent to your email.");
  };

  return (
    <View style={styles.maincontainer}>
      {loading && <LoadingSpinner />}
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/PixelPalslogoclearv2.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.headline}>Login</Text>
        <View style={styles.inputContainer}>
          <Icon name="user" size={22} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
            placeholderTextColor={colors.white}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={22} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholderTextColor={colors.white}
          />
        </View>
        <View style={styles.ForgotPasswordContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <MyButton
            text="Login"
            onPress={handleLogin}
            buttonStyle={styles.buttonLogin}
          />
          <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>or Login via</Text>
          </View>
          <Icon.Button
            name="google"
            backgroundColor={colors.background80}
            style={styles.button}
            onPress={() => Alert.alert("Oops", "In Progress..")}
          >
            <Text style={styles.text}>Login with Google</Text>
          </Icon.Button>
        </View>
      </View>
      <View style={styles.bottompagesignup}>
        <Text style={styles.label}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.background80,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 30,
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
    color: colors.white,
    marginBottom: 40,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    color: colors.white,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "80%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 30,
  },
  label: {
    color: colors.white,
    fontFamily: "Roboto",
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
    color: colors.white,
    fontSize: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.google,
  },
  buttonLogin: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 15,
    color: colors.white,
  },
  dividerContainer: {
    flexDirection: "column",
    alignItems: "center",
    opacity: 0.8,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: colors.white,
  },
  bottompagesignup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    padding: 10,
    marginTop: 50,
  },
  signupText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});

export default LoginScreen;
