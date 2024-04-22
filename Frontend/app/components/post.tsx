import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { postApi } from "../api/postApi";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../styles/themeStyles";
import { userApi } from "../api/userApi";

type PostProps = {
  post: {
    _id: string;
    owner: string; // ID of the owner
    content: string;
    photo?: string;
    likes: string[];
    isLikedByCurrentUser: boolean;
  };
};

const getUserDetails = async (ownerId: string) => {
  try {
    const response = await userApi.getUserById(ownerId);
    const user = response.data;
    return {
      username: user.username,
      profilePicture: user.profilePicture,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return {
      username: "Unknown User",
      profilePicture: null,
    };
  }
};

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [user, setUser] = useState({ username: '', profilePicture: null });

  useEffect(() => {
    const fetchData = async () => {
      const userDetails = await getUserDetails(post.owner);
      setUser({
        username: userDetails.username,
        profilePicture: userDetails.profilePicture,
      });
    };

    fetchData();
  }, [post.owner]);

  const handleLike = async () => {
    try {
      // Toggle the like state optimistically
      setIsLiked(!isLiked);
      if (isLiked) {
        await postApi.unlikePost(post._id);
      } else {
        await postApi.likePost(post._id);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      // Revert the like state in case of failure
      setIsLiked(!isLiked);
      Alert.alert("Error", "Failed to update like. Please try again.");
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <Image
          source={user.profilePicture ? { uri: user.profilePicture } : require("../../assets/defaultprofile.jpg")}
          style={styles.profilePic}
        />
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      {post.photo && (
        <Image source={{ uri: post.photo }} style={styles.image} />
      )}
      <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
        <Icon
          name="heart"
          size={25}
          color={isLiked ? "red" : "grey"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.white
  },
  username: {
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    fontSize: 16,
    color: colors.white,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  likeButton: {
    alignSelf: "center",
  },
});

export default Post;
