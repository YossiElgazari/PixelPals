import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { postApi } from "../api/postApi";
import MyButton from "../components/myButton";
import LoadingSpinner from "../components/loading"; // Import LoadingSpinner component
import { colors } from "../styles/themeStyles";

const AddPostScreen = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPost = async () => {
    setIsLoading(true);
    try {
      const post = { content, photo: photo || "" };
      console.log("Adding post:", post);
      await postApi.createPost(post);
      alert("Post added successfully!");
      setPhoto(null);
      setContent("");
    } catch (error) {
      console.log("Failed to add post:", error);
      console.log("Failed to add post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    if (!result.canceled && result.assets.length > 0) {
      console.log(result.assets[0].uri);
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/imagebg.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Create a New Post</Text>
        {photo && <Image source={{ uri: photo }} style={styles.previewImage} />}
        <TextInput
          style={styles.input}
          onChangeText={setContent}
          value={content}
          placeholder="Express yourself..."
          placeholderTextColor="#999"
          multiline
        />
        {isLoading ? (
          <LoadingSpinner /> // Replace ActivityIndicator with LoadingSpinner
        ) : (
          <>
            <MyButton text="Select Image" onPress={pickImage} buttonStyle={styles.button}/>
            <MyButton text="Add Post" onPress={handleAddPost} buttonStyle={styles.button}/>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 10,
    gap: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    minHeight: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.primary,
    backgroundColor: colors.background80,
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    minWidth: 300,
  }
});

export default AddPostScreen;
