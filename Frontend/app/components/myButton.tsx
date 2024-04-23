import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "../styles/themeStyles";
import Icon from "react-native-vector-icons/FontAwesome";

type MyButtonProps = {
  text: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
};

const MyButton: React.FC<MyButtonProps> = ({
  text,
  onPress,
  buttonStyle,
  textStyle,
  icon,
}) => {
  const finalButtonStyle = buttonStyle || styles.button;
  const finalTextStyle = textStyle || styles.text;

  return (
      <TouchableOpacity onPress={onPress} style={[styles.button, finalButtonStyle]}>
        {icon && <Icon name={"icon"} size={20} color="#fff" style={styles.icon} />}
        <Text style={finalTextStyle}>{text}</Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.primary,
    backgroundColor: colors.background80,
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    minWidth: 100,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
});

export default MyButton;
