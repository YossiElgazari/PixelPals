import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {postApi} from "../api/postApi";
import MyButton from "../components/myButton";

const AddPostScreen = () => {
  const [pic, setPic] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPost = async () => {
    if (!pic) {
      alert("Please select an image to post.");
      return;
    }

    setIsLoading(true);
    try {
      const post = { content, pic };
      await postApi.createPost(post);
      alert('Post added successfully!');
      setPic(null);
      setContent("");
    } catch (error) {
      console.error("Failed to add post:", error);
      alert("Failed to add post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is denied.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPic(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground source={require("../../assets/imagebg.png")} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Create a New Post</Text>
        {pic && (
          <Image source={{ uri: pic }} style={styles.previewImage} />
        )}
        <TextInput
          style={styles.input}
          onChangeText={setContent}
          value={content}
          placeholder="Write something about your photo..."
          placeholderTextColor="#999"
          multiline
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <MyButton text="Select Image" onPress={pickImage} />
            <MyButton text="Add Post" onPress={handleAddPost} />
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '80%',
    minHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: "#3897f0",
    padding: 12,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default AddPostScreen;
