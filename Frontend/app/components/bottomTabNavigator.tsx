import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/homeScreen";
import ProfileScreen from "../screens/profileScreen";
import SearchScreen from "../screens/searchScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import ExploreScreen from "../screens/exploreScreen";
import AddPostScreen from "../screens/addPostScreen";
import { colors } from "../styles/themeStyles";


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
            color = focused ? colors.primary : "gray";
          } else if (route.name === "SearchTab") {
            iconName = focused ? "search" : "search-outline";
            color = focused ? colors.lightb : "gray";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
            color = focused ? colors.primary : "gray";
          } else if (route.name === "ExploreTab") {
            iconName = focused ? "compass" : "compass-outline";
            color = focused ? colors.lightb : "gray";
          } else if (route.name === "AddPostTab") {
            iconName = focused ? "add-circle" : "add-circle-outline";
            color = focused ? colors.primary : "gray";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.background80, borderTopColor: colors.grey, borderTopWidth: 2},
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="SearchTab" component={SearchScreen} />
      <Tab.Screen name="AddPostTab" component={AddPostScreen} />
      <Tab.Screen name="ExploreTab" component={ExploreScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
