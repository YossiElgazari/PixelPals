import React from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { View, Text, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";

const slides = [
  {
    key: 'one',
    title: 'Discover New Friends',
    text: 'Connect with gamers around the world',
    image: require('../assets/slide1.png'),
    backgroundColor: '#1A1A1D',
  },
  {
    key: 'two',
    title: 'Get Social',
    text: 'Share your interests with others',
    image: require('../assets/slide1.png'),
    backgroundColor: '#4E4E50',
  },
  {
    key: 'three',
    title: 'Share Your Gaming Moments',
    text: 'Post your highlights and clips',
    image: require('../assets/slide1.png'),
    backgroundColor: '#6F2232',
  },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};



const OnboardingScreen: React.FC<Props> = ({ navigation }) => {

  const onDone = () => {
    // Set a flag indicating onboarding has been completed
    AsyncStorage.setItem('onboardingCompleted', 'true').then(() => {
      navigation.replace("Login");
    });
  };

  const onSkip = () => {
    AsyncStorage.setItem('onboardingCompleted', 'true').then(() => {
      navigation.replace("Login");
    });
  };

  return (
    <AppIntroSlider
      renderItem={({ item }) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      )}
      data={slides}
      onDone={onDone}
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  image: {
    width: 320,
    height: 320,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  dotStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDotStyle: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
