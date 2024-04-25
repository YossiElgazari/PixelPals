import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { userApi } from "../api/userApi"; // Import userApi
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Search">;
};

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]); // Update to specify the User type

  // Function to handle searching users
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 1) {
      try {
        const response = await userApi.searchUsers(query); // Call the searchUsers function from the userApi
        setSearchResults(response.data); // Assuming the API response structure has a 'data' field with search results
      } catch (error) {
        console.log("Search failed:", error);
        setSearchResults([]); // Reset the search results on error
      }
    } else {
      setSearchResults([]); // Clear results if the query is too short
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setSearchQuery("");
        setSearchResults([]);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        placeholderTextColor="#ccc"
        style={styles.searchInput}
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id} 
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("UserProfile", { userId: item._id })}>
          <View style={styles.userContainer}>
            <Image
              source={
                item.profilePicture
                  ? { uri: item.profilePicture }
                  : require("../../assets/defaultprofile.jpg")
              }
              style={styles.profileImage}
            />
            <Text style={styles.username}>{item.username}</Text>
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  searchInput: {
    fontSize: 18,
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  resultText: {
    color: "#fff",
    padding: 10,
    fontSize: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SearchScreen;
