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
      const userData = { username, email, password, passwordHash: password};
      const response = await authApi.register(userData);
      if (response.status === 201) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Home');
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }    
  };

  return (
    <View style={styles.maincontainer}>
    <View style={styles.container}>
      <Text style={styles.headline}>Create Account</Text>
      <View style={styles.imageContainer}>
  <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
    <Image source={profilePic ? { uri: profilePic } : defaultProfilePic} style={styles.image} />
    <Icon name="plus" size={24} style={styles.editIcon}/>
  </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.background, 
    marginBottom: 30,

  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    color: colors.textPrimary,
  },
  button: {
    borderRadius: 60,
    marginBottom: 20,
  },
  buttonText: {
    color: colors.textPrimary, 
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'column',

  },
  label: {
    color: colors.textPrimary,
    fontFamily: "Roboto",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderColor: colors.background,
    borderWidth: 3,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative', 
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
    marginBottom: 20,
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
    marginBottom: 10,
  },
  signinText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
  imageButton: {
    marginBottom: 20,
    position: 'relative', // Needed to position the icon correctly
  },
  editIcon: {
    position: 'absolute', // Position over the image
    bottom: 10, // Distance from the bottom of the container
    right: 5, // Distance from the right of the container
    backgroundColor: 'transparent',
    color: colors.textPrimary,
  }
  
});

export default RegisterScreen;
