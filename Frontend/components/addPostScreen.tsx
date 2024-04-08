// screens/AddPostScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AddPostScreen: React.FC = () => {
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
