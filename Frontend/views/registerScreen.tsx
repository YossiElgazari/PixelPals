import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authApi } from '../api/authApi';
import { RootStackParamList } from '../App';
import { colors } from '../styles/themeStyles';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/FontAwesome";

const defaultProfilePic = require('../assets/defaultprofile.jpg');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};


const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      const userData = { username, email, password, passwordHash: password };
      console.log(userData);
      const response = await authApi.register(userData);
      if (response.status === 201) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Login');
      } else {
        throw new Error('Failed to register');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    if (!result.canceled && 'uri' in result) {
      setProfilePic(result.uri as string);
    }
  };

  return (
    <View style={styles.maincontainer}>
    <View style={styles.container}>
      <Text style={styles.headline}>Create Account</Text>
      <View style={styles.imageContainer}>
      <Image source={profilePic ? { uri: profilePic as string } : defaultProfilePic} style={styles.image} />
      </View>
      <View style={styles.inputsContainer}>
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
      <Icon name="envelope" size={18} color={colors.background} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
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
      </View>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Profile Picture</Text>
      </TouchableOpacity>
      {profilePic && (
        <Image source={{ uri: profilePic }} style={styles.image} />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={handleRegister}
          color={colors.background} 
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
    backgroundColor: colors.secondary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.background, 
    
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.background, 
    padding: 5,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: colors.textPrimary, 
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'column',
    gap: 20,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: "Roboto",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderColor: colors.background,
    borderWidth: 3,
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderBottomWidth: 2,
    borderBottomColor: colors.background,
    marginBottom: 20,
  },
  inputsContainer: {
    width: '100%',
    alignItems: 'center',
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
    color: "#FFFFFF",
  },
  bottompagesignin: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  signinText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
});

export default RegisterScreen;
