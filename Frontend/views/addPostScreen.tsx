import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddPost'>;
};

const AddPostScreen: React.FC<Props> = () => {
  // post creation logic
  const handleAddPost = () => {
    // post addition logic
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAddPost} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Post</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#e91e63', 
    padding: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff', 
    fontSize: 18,
  },
});

export default AddPostScreen;
