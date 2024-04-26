import React, { useEffect, useCallback, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Share } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { userApi } from "../api/userApi";
import { colors } from "../styles/themeStyles";
import { RootStackParamList } from "../../App";
import LoadingSpinner from "../components/loading";
import MyButton from "../components/myButton";
import { useAuth } from "../context/AuthContext";
import { PostType } from "../screens/homeScreen";
import Post from "../components/post";


type UserProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ navigation, route }) => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState({
    _id: "",
    username: "",
    bio: "",
    profilePicture: "",
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  useEffect(() => {
    const checkIfCurrentUserProfile = async () => {
      setLoading(true);
      try {
        setIsCurrentUserProfile(authState?.userId === userId);
      } catch (error) {
        console.log("Failed to check if current user profile:", error);
      }
      setLoading(false);
    }

    fetchUserInfo();
    checkIfCurrentUserProfile();
  }, [userId]);

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserProfileById(userId);
      setUserInfo({
        _id: response.data.user._id,
        username: response.data.user.username,
        profilePicture: response.data.user.profilePicture,
        bio: response.data.user.bio,
        postsCount: response.data.postsCount,
        followersCount: response.data.followersCount,
        followingCount: response.data.followingCount,
      });
      setPosts(response.data.userPosts);

    } catch (error) {
      console.log("Failed to fetch user info:", error);
    }
    setLoading(false);
  }, [userId]);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserInfo().then(() => setRefreshing(false));
  }, [fetchUserInfo]);

  const shareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${userInfo.username}'s profile on PixelPals: https://pixelpals.com/profile/${userInfo.username}`,
      });
    } catch (error) {
      console.log("Error", "Unable to share profile.");
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userInfo.username}'s profile</Text>
      </View>
      <View style={styles.profileHeader}>
        <Image
          source={
            userInfo.profilePicture
              ? { uri: userInfo.profilePicture }
              : require("../../assets/defaultprofile.jpg")
          }
          style={styles.profileImage}
        />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("followersList", {
                userId: userInfo._id,
                username: userInfo.username,
              })
            }
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("followingList", {
                userId: userInfo._id,
                username: userInfo.username,
              })
            }
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.userTable}>
        <Text style={styles.username}>{userInfo.username}</Text>
        {userInfo.bio ? <Text style={styles.bio}>{userInfo.bio}</Text> : null}
      </View>
      <View style={styles.buttonsTable}>
        <MyButton
          text="Follow"
          onPress={() => { }}
          buttonStyle={styles.editButton}
          textStyle={styles.textEditButton}
          visible={!isCurrentUserProfile}
        />
        <MyButton
          text="Share Profile"
          onPress={shareProfile}
          buttonStyle={styles.editButton}
          textStyle={styles.textEditButton}
        />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Post
            post={item}
            user={userInfo}
            navigation={navigation}
          />
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 5,
    paddingBottom: 7,
    backgroundColor: colors.background80,
  },
  header: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.background80,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    flex: 1,
    width: "100%",
  },
  actionIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 10,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
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
    minWidth: 70,
    textAlign: "center",
  },
  userTable: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingBottom: 10,
    borderBottomColor: "grey",
    backgroundColor: colors.background80,
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  bio: {
    color: "white",
    fontSize: 14,
  },
  buttonsTable: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    backgroundColor: colors.background80,
    padding: 10,
    paddingTop: 0,
  },
  dotsMenu: {
    backgroundColor: colors.background80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopColor: colors.primary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  dotsSecondMenu: {
    backgroundColor: colors.background80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderTopColor: colors.primary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
  },
  dotsText: {
    color: "white",
    fontSize: 18,
    padding: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    textAlign: "center",
  },
  dotsTitleText: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    width: "45%",
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  textEditButton: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserProfileScreen;
