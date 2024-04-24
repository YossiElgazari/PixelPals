import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import { userApi } from "../api/userApi"; // Import userApi

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle searching users
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) { // Only search if the query is longer than 2 characters to avoid too many requests
      try {
        const response = await userApi.searchUsers(query);
        setSearchResults(response.data); // Assuming the API response structure has a 'data' field with search results
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]); // Reset the search results on error
      }
    } else {
      setSearchResults([]); // Clear results if the query is too short
    }
  };

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
        keyExtractor={(item) => item.id} // Replace 'id' with the actual unique identifier from your user objects
        renderItem={({ item }) => (
          <Text style={styles.resultText}>{item.username}</Text> // Adjust fields based on your user object structure
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
});

export default SearchScreen;
