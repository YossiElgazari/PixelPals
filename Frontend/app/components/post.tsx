import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../styles/themeStyles";
import { postApi } from "../api/postApi";

type PostProps = {
  post: {
    _id: string;
    owner: string;
    content: string;
    photo?: string;
    likes: string[];
    isLikedByCurrentUser: boolean;
  };
  user: {
    username: string;
    profilePicture?: string;
  };
  navigation: any;
};

const Post: React.FC<PostProps> = ({ post, user, navigation }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);

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
      console.log("Error liking the post:", error);
      // Revert the like state in case of failure
      setIsLiked(!isLiked);
      console.log("Error", "Failed to update like. Please try again.");
    }
  };

  return (
    <View style={styles.postContainer}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() =>
          navigation.navigate("UserProfile", { userId: post.owner })
        }
      >
        <Image
          source={
            user.profilePicture
              ? { uri: user.profilePicture }
              : require("../../assets/defaultprofile.jpg")
          }
          style={styles.profilePic}
        />
        <Text style={styles.username}>{user.username}</Text>
      </TouchableOpacity>
      <Text style={styles.content}>{post.content}</Text>
      {post.photo && (
        <Image source={{ uri: post.photo }} style={styles.image} />
      )}
      <View style={styles.likeCommentContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Icon name="heart" size={25} color={isLiked ? "red" : "grey"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    color: colors.white,
  },
  content: {
    fontSize: 16,
    color: colors.white,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  likeCommentContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
  },
  likeButton: {},
});

export default Post;
