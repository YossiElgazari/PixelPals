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
import { authApi, setAuthToken } from '../api/authApi';
import { RootStackParamList } from '../App';
import { colors } from '../styles/themeStyles';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleRegister = async () => {
    try {
      const userData = { username, email, password, profilePic };
      const response = await authApi.register(userData);
      if (response.status === 200) {
        Alert.alert('Success', 'Registration successful. Please login to continue.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        throw new Error('Failed to register');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };
  

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      }) as ImagePicker.ImagePickerResult;

      // Check if the image picker was not canceled and has a uri
      if (!result.canceled && 'uri' in result) {
        setProfilePic(result.uri as string);
      }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        placeholderTextColor={colors.textPrimary}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
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
        <Button
          title="Back to Login"
          onPress={() => navigation.navigate('Login')}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.background,
    marginBottom: 40,
  },
  input: {
    width: '80%',
    height: 40,
    borderBottomWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: colors.textPrimary,
    borderWidth: 0,
    borderBottomColor: colors.background,
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
    justifyContent: 'space-between',
    gap: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
});

export default RegisterScreen;
