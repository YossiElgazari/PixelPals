import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../styles/themeStyles';
import Icon from "react-native-vector-icons/FontAwesome";
import { userApi } from '../api/userApi';


type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
};

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    try {
      const res = await userApi.updatePassword({ oldPassword, newPassword });
      console.log('Password reset:', res);
      Alert.alert('Success', 'Password reset successfully.');
      navigation.navigate('Profile');
    } catch (error) {
      console.log('Failed to reset password:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  useEffect(() => {
  }, []);

  return (
    <View style={styles.maincontainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Icon name="arrow-left" size={22} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
        </View>
        <Text style={styles.headline}>Reset Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color={colors.white} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            placeholderTextColor={colors.white}
            secureTextEntry={true}
            onChangeText={setOldPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color={colors.white} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={colors.white}
            secureTextEntry={true}
            onChangeText={setNewPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color={colors.white} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor={colors.white}
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
          />
        </View>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.text}>Reset Password</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.background80,
  },
  container: {
    paddingTop: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  backArrow: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
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
  buttonContainer: {
    width: "80%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 15,
    color: colors.white,
  },

});

export default ResetPasswordScreen;
