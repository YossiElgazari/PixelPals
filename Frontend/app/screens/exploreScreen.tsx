import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explore Content</Text>
      {/*  content  */}
      {/*  navigation  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', 
  },
  text: {
    color: 'white', 
  },
});

export default ExploreScreen;
