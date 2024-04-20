import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, FlatList, Image, Text, ImageBackground } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import Post from "../components/post";
import { postApi } from "../api/postApi";
import LoadingSpinner from "../components/loading";
import { colors } from "../styles/themeStyles";

interface Post {
  _id: string;
  owner: string;
  content: string;
  photo: string;
  likes: string[];
  isLikedByCurrentUser: boolean;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animation for the header
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postApi.fetchPosts();
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <ImageBackground source={require("../../assets/imagebg.png")} style={styles.backgroundImage}>
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : posts.length > 0 ? (
        <Animated.FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Post post={item} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={16}
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
        <Image source={require("../../assets/PixelPalstext2.png")} style={styles.headerText}/> 
      </Animated.View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, 
    width: null, 
    height: null, 
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingTop: 50,
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
    backgroundColor: colors.background,
    height: 50,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    width: 200,
    height: 50,
    resizeMode: "contain",
  },
});

export default HomeScreen;
