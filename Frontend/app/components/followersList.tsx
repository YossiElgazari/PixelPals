import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { userApi } from "../api/userApi";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../styles/themeStyles";

interface Follower {
  _id: string;
  username: string;
  profilePicture: string;
  isFollowing: boolean;
}

const FollowerList = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const userId = route.params.userId;
  const username = route.params.username;

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await userApi.getFollowers(userId);
        setFollowers(response.data);
      } catch (error) {
        console.log("Failed to fetch followers:", error);
      }
    };

    fetchFollowers();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFollowers = async () => {
        try {
          const response = await userApi.getFollowers(userId);
          setFollowers(response.data);
        } catch (error) {
          console.log("Failed to fetch followers:", error);
        }
      };

      fetchFollowers();

      return () => {};
    }, [userId])
  );

  const handleFollow = async (followerId: string) => {
    try {
      await userApi.followUser(followerId);
      setFollowers((prevFollowers) =>
        prevFollowers.map((follower) =>
          follower._id === followerId
            ? { ...follower, isFollowing: true }
            : follower
        )
      );
    } catch (error) {
      console.log("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async (followerId: string) => {
    try {
      await userApi.unfollowUser(followerId);
      setFollowers((prevFollowers) =>
        prevFollowers.map((follower) =>
          follower._id === followerId
            ? { ...follower, isFollowing: false }
            : follower
        )
      );
    } catch (error) {
      console.log("Failed to unfollow user:", error);
    }
  };

  const renderItem = ({ item }: { item: Follower }) => (
    <View style={styles.itemContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={
            item.profilePicture
              ? { uri: item.profilePicture }
              : require("../../assets/defaultprofile.jpg")
          }
          style={styles.profileImage}
        />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          item.isFollowing ? handleUnfollow(item._id) : handleFollow(item._id)
        }
      >
        <Text style={styles.buttonText}>
          {item.isFollowing ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Icon name="arrow-left" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{username}'s followers</Text>
      </View>
      <FlatList
        data={followers}
        keyExtractor={(item, index) => item._id || `${index}`}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    padding: 10,
    backgroundColor: colors.background80,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  username: {
    fontSize: 16,
    color: colors.white,
  },
  button: {
    padding: 5,
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 30,
    marginRight: 5,
  },
  buttonText: {
    color: "white",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  backArrow: {
    position: "absolute",
    left: 10,
  },
});


export default FollowerList;
