import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/userApi";
import { useActionSheet } from "@expo/react-native-action-sheet";
import MyButton from "../components/myButton";
import { colors } from "../styles/themeStyles";
import * as ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../../App";
import * as Clipboard from "expo-clipboard";
import { UserModel } from "../models/userModel";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Profile">;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { onLogout } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const [userInfo, setUserInfo] = useState<UserModel>({
    _id: "",
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUserInfo = async () => {
        try {
          const response = await userApi.getUserProfile();
          if (isActive) {
            setUserInfo({
              _id: response.data.user._id,
              username: response.data.user.username,
              email: response.data.user.email,
              bio: response.data.user.bio,
              profilePicture: response.data.user.profilePicture,
              postsCount: response.data.postsCount,
              followersCount: response.data.followersCount,
              followingCount: response.data.followingCount,
            });
          }
        } catch (error) {
          console.log("Failed to fetch user info:", error);
        }
      };

      fetchUserInfo();

      return () => {
        isActive = false; // Cleanup flag on unmount
      };
    }, [])
  );

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const openActionSheet = () => {
    const options = ["Logout", "Delete User", "Reset Password", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        destructiveColor: colors.primary,
        containerStyle: styles.dotsMenu,
        textStyle: styles.dotsText,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          confirmAction("Logout");
        } else if (buttonIndex === 1) {
          confirmAction("Delete User");
        } else if (buttonIndex === 2) {
          navigation.navigate("ResetPassword");
        }
      }
    );
  };

  const confirmAction = (action: string) => {
    const options = ["Yes", "No"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        title: `Are you sure you want to ${action.toLowerCase()}?`,
        titleTextStyle: styles.dotsTitleText,
        textStyle: styles.dotsText,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        destructiveColor: colors.primary,
        containerStyle: styles.dotsSecondMenu,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          if (action === "Logout") {
            onLogout!();
          } else if (action === "Delete User") {
            // Add your logic here to delete the user
          }
        }
      }
    );
  };

  const ActionSheetProfile = () => {
    const options = ["Choose From Gallery", "Take Photo", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        containerStyle: styles.dotsMenu,
        textStyle: styles.dotsText,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          chooseFromGallery();
        } else if (buttonIndex === 1) {
          takePhoto();
        }
      }
    );
  };

  const chooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera roll is required!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0].uri) {
      setUserInfo({ ...userInfo, profilePicture: result.assets[0].uri });
      try {
        await userApi.updateProfilePicture({
          profilePicture: result.assets[0].uri,
        });
      } catch (error) {
        console.log("Failed to update profile image:", error);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera is required!"
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0].uri) {
      setUserInfo({ ...userInfo, profilePicture: result.assets[0].uri });
      try {
        await userApi.updateProfilePicture({
          profilePicture: result.assets[0].uri,
        });
      } catch (error) {
        console.log("Failed to update profile image:", error);
      }
    }
  };

  const copyProfileURL = () => {
    const profileURL = "https://pixelpals.com/profile/" + userInfo.username;
    Clipboard.setStringAsync(profileURL);
    Alert.alert(
      "Profile URL Copied",
      "Your profile URL has been copied to the clipboard!"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.actionIconContainer}>
            <TouchableOpacity
              onPress={openActionSheet}
              style={{
                backgroundColor: colors.background80,
                padding: 5,
                borderRadius: 10,
              }}
            >
              <Icon name="ellipsis-v" size={26} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={ActionSheetProfile}
          >
            <Image
              source={
                userInfo.profilePicture
                  ? { uri: userInfo.profilePicture }
                  : require("../../assets/defaultprofile.jpg") // Use the default image if no profilePicture is present
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userInfo.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("followersList", {
                  userId: userInfo._id,
                  username: userInfo.username,
                })
              }
            >
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userInfo.followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("followingList", {
                  userId: userInfo._id,
                  username: userInfo.username,
                })
              }
            >
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userInfo.followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userTable}>
          <Text style={styles.username}>{userInfo.username}</Text>
          {userInfo.bio ? <Text style={styles.bio}>{userInfo.bio}</Text> : null}
        </View>
        <View style={styles.buttonsTable}>
          <MyButton
            text="Edit Profile"
            onPress={handleEditProfile}
            buttonStyle={styles.editButton}
            textStyle={styles.textEditButton}
          />
          <MyButton
            text="Share Profile"
            onPress={copyProfileURL}
            buttonStyle={styles.editButton}
            textStyle={styles.textEditButton}
          />
        </View>
        {/* Grid of posts or other content */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 5,
    paddingBottom: 7,
    position: "relative",
    backgroundColor: colors.background80,
  },
  actionIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 10,
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
    paddingLeft: 15,
    paddingBottom: 10,
    borderBottomColor: "grey",
    backgroundColor: colors.background80,
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
  buttonsTable: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    backgroundColor: colors.background80,
    padding: 10,
    paddingTop: 0,
  },
  dotsMenu: {
    backgroundColor: colors.background80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopColor: colors.primary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  dotsSecondMenu: {
    backgroundColor: colors.background80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderTopColor: colors.primary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
  },
  dotsText: {
    color: "white",
    fontSize: 18,
    padding: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    textAlign: "center",
  },
  dotsTitleText: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    width: "45%",
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  textEditButton: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProfileScreen;
