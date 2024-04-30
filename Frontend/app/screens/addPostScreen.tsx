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
import { useFocusEffect } from "@react-navigation/native";

const AddPostScreen = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setPhoto(null);
        setContent("");
      };
    }, [])
  );

  const handleAddPost = async () => {
    setIsLoading(true);
    try {
      if (!photo) {
        const post = { content };
        await postApi.createPost(post);
      } else { 
        const post = { content, photo };
        await postApi.createPost(post);
      } 
      alert("Post added successfully!");
      setPhoto(null);
      setContent("");
    } catch (error) {
      console.log("Failed to add post:", error);
      alert("Failed to add post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert(
      "Permission to access camera roll is denied."
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
  }
};

const takePhoto = async () => {
  const permissionResult =
    await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    alert(
      "Permission to access camera is denied."
    );
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
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
          <LoadingSpinner /> 
        ) : (
          <>
            <MyButton text="Select Image" onPress={pickImage}/>
            <View style={{ height: 10 }}></View>
            <MyButton text="Take Photo" onPress={takePhoto}/>
            <MyButton text="Add Post" onPress={handleAddPost} buttonStyle={styles.addButton}/>
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
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    minHeight: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectImageButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: colors.primary,
    borderColor: colors.background,
    marginVertical: 10,
    borderWidth: 4,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
});

export default AddPostScreen;
