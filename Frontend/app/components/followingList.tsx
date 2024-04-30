import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { userApi } from "../api/userApi";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../styles/themeStyles";

interface Following {
  _id: string;
  username: string;
  profilePicture: string;
  isFollowing: boolean;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "followingList">;
};

const FollowingList = ({ route,navigation }: { route: any, navigation:any }) => {
  const [following, setFollowing] = useState<Following[]>([]);
  const userId = route.params.userId;
  const username = route.params.username;
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await userApi.getFollowing(userId);
        setFollowing(response.data);
      } catch (error) {
        console.log("Failed to fetch following:", error);
      }
    };

    fetchFollowing();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFollowing = async () => {
        try {
          const response = await userApi.getFollowing(userId);
          setFollowing(response.data);
        } catch (error) {
          console.log("Failed to fetch followers:", error);
        }
      };

      fetchFollowing();

      
      return () => {};
    }, [userId]) 
  );

  const handleFollow = async (followingId: string) => {
    try {
      await userApi.followUser(followingId);
      // Update the local state to reflect the change
      setFollowing(
        following.map((following) => {
          if (following._id === followingId) {
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
          if (following._id === followingId) {
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
        <Text style={styles.headerTitle}>{username}'s following</Text>
      </View>
      <FlatList
        data={following}
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


export default FollowingList;
