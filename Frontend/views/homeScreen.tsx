import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, FlatList } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Post from "../components/post";
import { postApi } from "../api/postApi";
import LoadingSpinner from "../components/loading";

interface Post {
  _id: string;
  content: string;
  photo?: string;
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
        setPosts(response.data.posts); // Ensure response.data.posts is correctly typed
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setLoading(false);
      }
    };
    setLoading(true);
    //fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
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
      )}

      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        {/* Optional header content */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  contentContainer: {
    paddingTop: 50,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#121212",
    height: 50,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
