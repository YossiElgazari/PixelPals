import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Image, Alert
} from 'react-native';
import { userApi } from '../api/userApi';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await userApi.getUserProfile();
        const { username, email, bio, profilePicture } = result.data;
        setUsername(username);
        setEmail(email);
        setBio(bio);
        setProfilePicture(profilePicture);
      } catch (error) {
        Alert.alert("Error", "Unable to fetch profile details.");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await userApi.updateUserProfile({ username, email, bio, profilePicture });
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        multiline
      />
      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.profilePic} />
      )}
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <Button title="Back to Profile" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  }
});

export default EditProfileScreen;
