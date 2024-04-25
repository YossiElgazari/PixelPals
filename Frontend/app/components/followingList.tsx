import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { userApi } from "../api/userApi";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

interface Following {
  id: string;
  username: string;
  isFollowing: boolean;
}

interface FollowingListProps {
  userId: string;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "followingList">;
};

const FollowingList = ({ route }: { route: any }) => {
  const [following, setFollowing] = useState<Following[]>([]);
  const userId = route.params.userId;
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await userApi.getFollowing(userId);
        setFollowing(response.data.following);
      } catch (error) {
        console.log("Failed to fetch following:", error);
      }
    };

    fetchFollowing();
  }, [userId]);

  const handleFollow = async (followingId: string) => {
    try {
      await userApi.followUser(followingId);
      // Update the local state to reflect the change
      setFollowing(
        following.map((following) => {
          if (following.id === followingId) {
            return { ...following, isFollowing: true };
          }
          return following;
        })
      );
    } catch (error) {
      console.log("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async (followingId: string) => {
    try {
      await userApi.unfollowUser(followingId);
      // Update the local state to reflect the change
      setFollowing(
        following.map((following) => {
          if (following.id === followingId) {
            return { ...following, isFollowing: false };
          }
          return following;
        })
      );
    } catch (error) {
      console.log("Failed to unfollow user:", error);
    }
  };

  const renderItem = ({ item }: { item: Following }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.username}>{item.username}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          item.isFollowing ? handleUnfollow(item.id) : handleFollow(item.id)
        }
      >
        <Text style={styles.buttonText}>
          {item.isFollowing ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={following}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  username: {
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});

export default FollowingList;
