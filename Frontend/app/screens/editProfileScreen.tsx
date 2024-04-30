import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Alert, StyleSheet, ScrollView
} from 'react-native';
import { userApi } from '../api/userApi';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../components/myButton';
import { colors } from '../styles/themeStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        const { username, email, bio, profilePicture } = result.data.user;
        setUsername(username);
        setEmail(email);
        setBio(bio);
        setProfilePicture(profilePicture);
      } catch (error) {
        console.log("Error", "Unable to fetch profile details.");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await userApi.updateUserProfile({ username, email, bio, profilePicture });
      Alert.alert("Success", "Profile updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.log("Error", "Failed to update profile.");
    }
  };

  return (
    <ScrollView style={styles.maincontainer}>
      <View style={styles.container}>
        <Text style={styles.headline}>Edit Profile</Text>
        <View style={styles.inputContainer}>
          <Icon name="user" size={22} color={colors.primary} />
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholderTextColor={colors.white}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={22} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor={colors.white}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="align-left" size={22} color={colors.primary} />
          <TextInput
            style={[styles.input, {height: 70}] }
            placeholder="Bio"
            onChangeText={setBio}
            value={bio}
            multiline
            placeholderTextColor={colors.white}
          />
        </View>
        <MyButton text="Update Profile" onPress={handleUpdateProfile} buttonStyle={styles.buttonLogin} />
        <MyButton text="Back to Profile" onPress={() => navigation.goBack()} buttonStyle={styles.buttonLogin} />
      </View>
    </ScrollView>
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
    padding: 20,
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
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonLogin: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
});

export default EditProfileScreen;
