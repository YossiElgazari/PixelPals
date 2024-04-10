import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../views/homeScreen';
import ProfileScreen from '../views/profileScreen';
import SearchScreen from '../views/searchScreen'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExploreScreen from '../views/exploreScreen'; 
import AddPostScreen from '../views/addPostScreen';

const Tab = createBottomTabNavigator();


const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size }) => {
        let iconName = 'help'; // Default icon name
        let color = 'gray'; // Default color
    
        if (route.name === 'TabHome') {
          iconName = focused ? 'home' : 'home-outline';
          color = focused ? '#d101fd' : 'gray'; 
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
          color = focused ? '#05d6ff' : 'gray'; 
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
          color = focused ? '#d101fd' : 'gray'; 
        } else if (route.name === 'Explore') {
          iconName = focused ? 'compass' : 'compass-outline';
          color = focused ? '#05d6ff' : 'gray'; 
        } else if (route.name === 'AddPost') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
          color = focused ? '#d101fd' : 'gray'; 
        }
        
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: { backgroundColor: '#121212' }, 
    })}
    >
      <Tab.Screen name="TabHome" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="AddPost" component={AddPostScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} /> 
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
