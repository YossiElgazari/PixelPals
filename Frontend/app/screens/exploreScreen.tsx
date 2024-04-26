import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import {colors} from '../styles/themeStyles';

const ExplorePage = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
    ]).start(() => {
      // Restart the animation
      startAnimation();
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const slide1Style = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  const slide2Style = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slide, styles.slide1, slide1Style]}>
        <Text style={styles.slideText}>Explore PixelPals</Text>
        <Text style={styles.slideText}>View everyone's posts</Text>
        <Text style={styles.slideText}>Discover new friends</Text>
      </Animated.View>
      <Animated.View style={[styles.slide, styles.slide2, slide2Style]}>
        <Text style={styles.slideText}>Share Your Experiences</Text>
        <Text style={styles.slideText}>Add posts with media and text</Text>
        <Text style={styles.slideText}>Connect with others</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  slide: {
    position: 'absolute',
    alignItems: 'center',
  },
  slide1: {
    backgroundColor: '#FF175C',
  },
  slide2: {
    backgroundColor : '#00BAFF',
  },
  slideText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

export default ExplorePage;
