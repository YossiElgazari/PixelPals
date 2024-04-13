import React, { useRef } from "react";
import { View, StyleSheet, ScrollView, Animated, Image } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../App";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<Props> = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // translateY will animate the whole header off the screen without resizing it
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50], // Start moving up when scrolling down
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        onScroll={(event) => {
          scrollY.setValue(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        {/* Dummy content to enable scrolling */}
        <View style={styles.content} />
      </ScrollView>

      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Image
          source={require("../assets/PixelPalstext.png")}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 50, 
  },
  content: {
    height: 1500, 
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  logo: {
    width: 200,
    height: 25,
    resizeMode: "contain",
  },
});

export default HomeScreen;
