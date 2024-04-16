import React, { useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../contexts/UserContext'; // Adjust import as necessary
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const { logout } = useContext(UserContext);

  const userInfo = {
    username: 'thegeek',
    profileImageUrl: require('../assets/defaultprofile.jpg'),
    postsCount: 123,
    followersCount: 440,
    followingCount: 558,
    bio: 'Journalist\nTech journalist and city',
  };

  const handleLogout = () => {
    logout().then(() => {
      navigation.replace("Login"); // Ensuring the user cannot navigate back to the profile after logout
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  const handleEditProfile = () => {
    //navigation.navigate("EditProfile"); // Ensure you have an "EditProfile" route defined in your navigation setup
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image source={userInfo.profileImageUrl} style={styles.profileImage} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="sign-out" size={24} color="white" /> 
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>{userInfo.username}</Text>
        <Text style={styles.bio}>{userInfo.bio}</Text>
        <Button title="Edit Profile" onPress={handleEditProfile} color="#1a73e8" />
        {/* Grid of posts or other content */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    color: 'grey',
    fontSize: 14,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  bio: {
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});

export default ProfileScreen;
