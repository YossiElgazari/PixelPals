// screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  // replace data from backend or state management
  const userInfo = {
    username: 'JohnDoe',
    email: 'johndoe@example.com'

  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Text style={styles.userInfo}>Username: {userInfo.username}</Text>
      <Text style={styles.userInfo}>Email: {userInfo.email}</Text>
      {/* Add more user info fields as necessary */}
      
      <Button
        title="Edit Profile"
        onPress={() => {
          // Placeholder for edit profile action
          //  could navigate to an EditProfileScreen or open an edit modal
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;
