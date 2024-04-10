import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {setAuthToken, authApi} from '../api'; // Ensure you're importing correctly based on your project structure
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userData = { username: "testUser", password: "1234" };
      const response = await authApi.login(userData);

      if (response.status === 200) {
        setAuthToken(response.data.token);
        navigation.navigate('Home');

      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
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
      <Button
        title="Login"
        onPress={handleLogin} // Call handleLogin function when the button is pressed
      />
      <Button
        title="Go to Registration"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});

export default LoginScreen;
