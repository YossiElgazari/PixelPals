import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { authApi } from "../api/authApi";
import { RootStackParamList } from "../../App";
import { colors } from "../styles/themeStyles";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/AuthContext";
import MyButton from "../components/myButton";
import LoadingSpinner from "../components/loading";

const defaultProfilePic = require("../../assets/defaultprofile.jpg");

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { onRegister, onLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (profilePic) {
        const newfilename = await authApi.uploadImage(profilePic);
        setProfilePic(newfilename);
      }
      const userData = { username, email, password };
      const result = await onRegister!(
        userData.username,
        userData.password,
        userData.email,
        profilePic!
      );
      if (result && result.error) {
        console.log(result.msg);
      } else {
        const loginResult = await onLogin!(
          userData.username,
          userData.password
        );
        navigation.navigate("Home");
        if (loginResult && loginResult.error) {
          console.log(loginResult.msg);
        }
      }
    } catch (error) {
      console.log("Failed to register:", error);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.maincontainer}>
      {loading && <LoadingSpinner />}
      <View style={styles.container}>
        <Text style={styles.headline}>Create Account</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Image
              source={profilePic ? { uri: profilePic } : defaultProfilePic}
              style={styles.image}
            />
            <Icon name="plus" size={24} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputsContainer}>
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
            <Icon name="envelope" size={18} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
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
        </View>
        <View style={styles.buttonContainer}>
          <MyButton
            text="Register"
            onPress={handleRegister}
            textStyle={{ color: colors.primary, fontWeight: "bold" }}
            buttonStyle={{ borderColor: colors.white }}
          />
        </View>
      </View>
      <View style={styles.bottompagesignin}>
        <Text style={styles.label}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signinText}>LOGIN</Text>
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
  headline: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    color: colors.white,
  },
  button: {
    borderRadius: 60,
    marginBottom: 20,
  },
  buttonText: {
    color: colors.white,
  },
  buttonContainer: {
    width: "80%",
    flexDirection: "column",
  },
  label: {
    color: colors.white,
    fontFamily: "Roboto",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: colors.white,
    borderWidth: 2,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: 20,
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  bottompagesignin: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 50,
    marginBottom: 10,
  },
  signinText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  imageButton: {
    marginBottom: 20,
    position: "relative", // Needed to position the icon correctly
  },
  editIcon: {
    position: "absolute", // Position over the image
    bottom: 20, // Distance from the bottom of the container
    right: 10, // Distance from the right of the container
    backgroundColor: "transparent",
    color: colors.white,
  },
});

export default RegisterScreen;
