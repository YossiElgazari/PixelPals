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
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useAuth } from "../context/AuthContext";

type PostProps = {
  post: {
    _id: string;
    owner: string;
    content: string;
    photo?: string;
    likes: string[];
  };
  user: {
    username: string;
    profilePicture?: string;
  };
  navigation: any;
};



const Post: React.FC<PostProps> = ({ post, user, navigation }) => {
  const { authState } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes.includes(authState?.userId || ""));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const { showActionSheetWithOptions } = useActionSheet();
  const isOwner = authState?.userId === post.owner;
  
  const handleLike = async () => {
    const previousLikeState = isLiked;
    const previousLikesCount = likesCount;
  
    setIsLiked(!previousLikeState);
    setLikesCount(previousLikeState ? previousLikesCount - 1 : previousLikesCount + 1);
  
    try {
      if (previousLikeState) {
        await postApi.unlikePost(post._id);
      } else {
        await postApi.likePost(post._id);
      }
    } catch (error) {
      console.log("Error liking the post:", error);
      Alert.alert("Like Error", "Failed to update like. Please check your network and try again.");
      // Revert UI on error
      setIsLiked(previousLikeState);
      setLikesCount(previousLikesCount);
    }
  };
  

  const openActionSheet = () => {
    const options = ["Edit Post", "Delete Post", "Cancel"];
    const destructiveButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        destructiveColor: colors.primary,
        containerStyle: styles.dotsMenu,
        textStyle: styles.dotsText,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          navigation.navigate("EditPost", { post, navigation });
        } else if (buttonIndex === 1) {
          confirmAction("Delete Post");
        }
      }
    );
  };

  const confirmAction = (action: string) => {
    const options = ["Yes", "No"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        title: `Are you sure you want to ${action.toLowerCase()}?`,
        titleTextStyle: styles.dotsTitleText,
        textStyle: styles.dotsText,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        destructiveColor: colors.primary,
        containerStyle: styles.dotsSecondMenu,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          if (action === "Delete Post") {
            try {
              await postApi.deletePost(post._id);           
            } catch (error) {
              console.log("Error deleting the post:", error);
            }
          }
        }
      }
    );
  };


  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.userInfo} onPress={() =>
          navigation.navigate("UserProfile", { userId: post.owner })
        }>
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
        {isOwner && (
          <TouchableOpacity onPress={openActionSheet} >
            <Icon name="ellipsis-v" size={22} color={colors.white} style={styles.dots} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.content}>{post.content}</Text>
      {post.photo && (
        <Image source={{ uri: post.photo }} style={styles.image} />
      )}
      <View style={styles.likeCommentContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Icon name="heart" size={25} color={isLiked ? "red" : "grey"} />
          <Text style={{ color: colors.white, marginLeft: 10 }}>
            {likesCount}
          </Text>
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
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: 5,
  },
  dots: {
    bottom: 5,
    marginRight: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
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
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
  dotsTitleText: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
});

export default Post;
