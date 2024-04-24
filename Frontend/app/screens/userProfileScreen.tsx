import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Share } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { userApi } from "../api/userApi";
import { colors } from "../styles/themeStyles";
import { RootStackParamList } from "../../App";

type UserProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState({
    username: "",
    bio: "",
    profileImageUrl: "",
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userApi.getUserById(userId);
        setUserInfo({
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl || '../../assets/defaultprofile.jpg',
          bio: response.data.bio,
          postsCount: response.data.postsCount,
          followersCount: response.data.followersCount,
          followingCount: response.data.followingCount,
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        Alert.alert("Error", "Failed to load user information.");
      }
    };

    fetchUserInfo();
  }, [userId]);

  const shareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${userInfo.username}'s profile on PixelPals: https://pixelpals.com/profile/${userInfo.username}`,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share profile.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userInfo.username}'s Profile</Text>
      </View>
      <ScrollView>
        <Image
          source={{ uri: userInfo.profileImageUrl || '../../assets/defaultprofile.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userInfo.username}</Text>
        <Text style={styles.bio}>{userInfo.bio}</Text>
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
        <TouchableOpacity style={styles.shareButton} onPress={shareProfile}>
          <Text style={styles.shareButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.background80,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginLeft: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.white,
    textAlign: "center",
  },
  bio: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    padding: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  statLabel: {
    color: "grey",
    fontSize: 14,
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfileScreen;
