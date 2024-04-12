import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  /// SEARCH FUNCTION
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    //  search logic
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
      {/*  FlatList for search results */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
  },
  searchInput: {
    fontSize: 18,
    backgroundColor: '#222', 
    color: '#fff', 
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
});

export default SearchScreen;
