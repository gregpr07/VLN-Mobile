import React from "react";
import { Feather } from "@expo/vector-icons";
import { Platform } from "react-native";

const headerOptions = (colors: any) => {
  return {
    headerStyle: {
      backgroundColor: colors.background,
      shadowColor: "transparent",
      elevation: 0,
      borderBottomWidth: 0,
    },
    //headerTintColor: themeIsDark ? colors.dark : colors.darkGreyBlue,
    headerTitleStyle: {
      fontFamily: "SF-UI-semibold",
      lineHeight: 22,
      letterSpacing: 1,
      textAlign: "center",
      color: colors.text,
      fontSize: 20,
      shadowOpacity: 0,
      /* paddingLeft: 12, */
    },
    headerBackImage: ({ tintColor }) => (
      <Feather
        name={"arrow-left"}
        size={24}
        style={{ marginLeft: 12 }}
        color={colors.text}
      />
    ),

    headerBackTitleVisible: false,
  };
};

export default headerOptions;
