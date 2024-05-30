import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { postApi } from '../api/postApi';
import { colors } from '../styles/themeStyles';
import MyButton from '../components/myButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "EditPost">;
};

const EditPostScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    const { _id, content, photo } = route.params.post;
    const [editedContent, setEditedContent] = useState(content);
    const [editedPhoto, setEditedPhoto] = useState(photo);

    const handleChoosePhoto = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
            aspect: [4, 3]
        }).then((result) => {
            if (!result.canceled && result.assets[0].uri) {
                setEditedPhoto(result.assets[0].uri);
            }
        }).catch((error) => {
            console.error('Error choosing photo:', error);
        });
    };

    const handleTakePhoto = () => {
        ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
            aspect: [4, 3]
        }).then((result) => {
            if (!result.canceled && result.assets[0].uri) {
                setEditedPhoto(result.assets[0].uri);
            }
        }).catch((error) => {
            console.error('Error taking photo:', error);
        });
    };

    const handleUpdatePost = async () => {
        try {
            // Check if there are any changes made to the post
            if (editedContent === content && editedPhoto === photo) {
                alert('No changes made to post');
                navigation.goBack();
                return;
            }
    
            // Prepare the data to be updated
            const updatedData = {
                content: editedContent,
                photo: editedPhoto
            };
    
            // Call the updatePost API
            const result = await postApi.updatePost(_id, updatedData);
    
            if (!result) {
                console.error('Error updating post');
                return;
            }
    
            // Navigate back after successful update
            navigation.goBack();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };
    


    return (
        <ScrollView style={styles.maincontainer}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={22} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={styles.headline}>Edit Post</Text>
                <Text style={styles.label}>Content:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEditedContent}
                        value={editedContent}
                        placeholder="Content"
                        placeholderTextColor={colors.white}
                    />
                </View>
                <Text style={styles.label}>Photo:</Text>
                {editedPhoto && (
                    <Image source={{ uri: editedPhoto }} style={styles.previewImage} />
                )}
                <MyButton text="Choose Photo" onPress={handleChoosePhoto} buttonStyle={styles.photoButton} />
                <MyButton text="Take Photo" onPress={handleTakePhoto} buttonStyle={styles.photoButton} />
                <MyButton text="Update Post" onPress={handleUpdatePost} buttonStyle={styles.updateButton} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: colors.background80,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        padding: 10,
    },
    headline: {
        fontSize: 32,
        fontWeight: "800",
        color: colors.white,
        marginBottom: 40,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        height: 40,
        color: colors.white,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "80%",
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        paddingLeft: 20,
        color: colors.white,
        fontSize: 16,
        marginBottom: 10,
    },
    photoButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.primary,
        borderRadius: 5,
        width: '80%',
        marginBottom: 10,
    },
    updateButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: colors.primary,
        borderWidth: 2,
        backgroundColor: colors.background,
        borderRadius: 5,
        width: '80%',
        marginBottom: 10,
    },
    previewImage: {
        width: 300,
        height: 300,
        marginBottom: 20,
        borderRadius: 10,
    },
});

export default EditPostScreen;
