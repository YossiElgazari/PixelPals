import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Image,
  Text,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import Post from "../components/post";
import { postApi } from "../api/postApi";
import { userApi } from "../api/userApi";
import LoadingSpinner from "../components/loading";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../styles/themeStyles";

export interface PostType {
  _id: string;
  owner: string;
  content: string;
  photo?: string;
  likes: string[];
  isLikedByCurrentUser: boolean;
}

interface UserType {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface UserMap {
  [key: string]: UserType;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [users, setUsers] = useState<UserMap>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await postApi.fetchPosts();
      if (response.data.length === 0 || !response.data) {
        setPosts([]);
        return;
      }
      const userResponses = await Promise.all(
        response.data.map((post: PostType) => userApi.getUserById(post.owner))
      );
      const userMap: UserMap = {};
      userResponses.forEach((userRes, index) => {
        const userData = userRes.data;
        userMap[response.data[index].owner] = {
          _id: userData._id,
          username: userData.username,
          profilePicture: userData.profilePicture,
        };
      });
      setPosts(response.data);
      setUsers(userMap);
    } catch (error) {
      console.log("Failed to fetch posts or user data:", error);
    } finally {
    setLoading(false);
    }
  } , []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, [fetchPosts]);

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : posts.length > 0 ? (
        <Animated.FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Post
              post={item}
              user={users[item.owner]}
              navigation={navigation}
            />
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={16}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      ) : (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>
            No posts yet, upload something!
          </Text>
        </View>
      )}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Image
          source={require("../../assets/PixelPalstextclear.png")}
          style={styles.headerImg}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingTop: 60,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    color: "white",
    fontSize: 18,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background80,
    height: 50,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey,
  },
  headerImg: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
});

export default HomeScreen;
