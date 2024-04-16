import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { postApi } from '../api/postApi'; // Ensure this import is correct
import Icon from 'react-native-vector-icons/FontAwesome';

type PostProps = {
  post: {
    _id: string;
    owner: string;
    content: string;
    photo?: string;
    likes: string[]; // Array of user IDs who liked the post
    isLikedByCurrentUser: boolean; // You may need to calculate this property based on user data
  };
};

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);

  const handleLike = async () => {
    try {
      // Toggle the like state optimistically
      setIsLiked(!isLiked);

      if (isLiked) {
        await postApi.unlikePost(post._id);
      } else {
        await postApi.likePost(post._id);
      }
    } catch (error) {
      console.error('Error liking the post:', error);
      // Revert the like state in case of failure
      setIsLiked(!isLiked);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  return (
    <View style={styles.postContainer}>
      <Text style={styles.content}>{post.content}</Text>
      {post.photo && (
        <Image source={{ uri: post.photo }} style={styles.image} />
      )}
      <TouchableOpacity onPress={handleLike}>
        <Icon name="heart" size={25} color={isLiked ? 'red' : 'grey'} style={styles.likeIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  content: {
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  likeIcon: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default Post;
