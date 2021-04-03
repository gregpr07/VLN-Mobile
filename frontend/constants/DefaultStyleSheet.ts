import { StyleSheet, Platform } from "react-native";

export const padding_const = 10;

export const border_radius = 15;

const defaultStyles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#6B7280",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowRadius: 3,
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default defaultStyles;
