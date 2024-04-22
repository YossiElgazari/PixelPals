import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/userApi";
import { RootStackParamList } from "../../App";
import { useActionSheet } from "@expo/react-native-action-sheet";
import MyButton from "../components/myButton";
import { colors } from "../styles/themeStyles";
import ResetPasswordScreen from "./resetPasswordScreen";
import { useNavigation } from "@react-navigation/native";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Profile">;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { onLogout } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const [userInfo, setUserInfo] = useState({
    username: "",
    bio: "",
    profileImageUrl: require("../../assets/defaultprofile.jpg"), // Adjusted for initial state
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userApi.getUserProfile();
        setUserInfo({
          ...userInfo,
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl, // Update the type to string
          bio: response.data.bio,
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const openActionSheet = () => {
    const options = ["Logout", "Delete User", "Reset Password", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        title: "Options",
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        containerStyle: styles.dotsMenu,
        textStyle:styles.dotsText,
        
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          confirmAction("Logout");
        } else if (buttonIndex === 1) {
          confirmAction("Delete User");
        } else if (buttonIndex === 2) {
          navigation.navigate('ResetPassword');
        }
      }
    );
  };

  const confirmAction = (action: string) => {
    const options = ["Yes", "No"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        title: `Are you sure you want to ${action.toLowerCase()}?`,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          if (action === "Logout") {
            onLogout!();
          } else if (action === "Delete User") {
            // Add your logic here to delete the user
          } else if (action === "Reset Password") {

          }
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.actionIconContainer}>
            <TouchableOpacity onPress={openActionSheet} style={{alignContent: "center"}}>
              <Icon name="ellipsis-v" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Image
            source={userInfo.profileImageUrl}
            style={styles.profileImage}
          />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        <View style={styles.userTable}>
          <Text style={styles.username}>{userInfo.username}</Text>
          <Text style={styles.bio}>{userInfo.bio}</Text>
          <MyButton text="Edit Profile" onPress={handleEditProfile}/>
        </View>
        {/* Grid of posts or other content */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    position: "relative",
    paddingBottom: 5,
  },
  actionIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 15,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  statLabel: {
    color: "grey",
    fontSize: 14,
    minWidth: 70,
    textAlign: "center",
  },
  userTable: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 15,
    paddingBottom: 10,
    gap: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  bio: {
    color: "white",
    fontSize: 14,
  },
  dotsMenu: {
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  },
  dotsText:{
  }
});

export default ProfileScreen;
