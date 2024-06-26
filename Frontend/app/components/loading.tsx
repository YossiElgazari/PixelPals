import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

const LoadingSpinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={styles.container}>
      <Animated.Image
        source={require('../../assets/PixelPalslogoclear.png')}
        style={[styles.logo, { transform: [{ rotate: spin }] }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default LoadingSpinner;
