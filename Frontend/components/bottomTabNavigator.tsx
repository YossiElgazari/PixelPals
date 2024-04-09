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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'TabHome') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'AddPost') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63', 
        tabBarInactiveTintColor: 'gray',
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
