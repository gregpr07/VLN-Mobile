import { StyleSheet } from "react-native";

export const padding_const = 10;

export const border_radius = 15;

const defaultStyles = StyleSheet.create({
  shadow: {
    shadowColor: "#6B7280",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
  },
});

export default defaultStyles;
