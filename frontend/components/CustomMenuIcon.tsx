import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  iconName: string;
  isCurrent?: boolean;
};

import { useTheme } from "@react-navigation/native";

export const BottomMenuItem = ({ iconName, isCurrent }: Props) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const { colors, dark } = useTheme();
  const giveIconName = (name: string) => {
    if (name === "Home") {
      return "ios-home";
    } else if (name === "Profile") {
      return "md-person";
    } else if (name == "Search") {
      return "ios-search";
    } else if (name == "DEV") {
      return "md-bug";
    } else if (name == "Player") {
      return "ios-play";
    } else if (name === "Video") {
      return "ios-videocam";
    }
  };
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "5vh",
        flexDirection: "row",
      }}
    >
      <Ionicons
        name={giveIconName(iconName)}
        size={26}
        style={{ color: isCurrent ? colors.text : colors.third }}
      />
      <Text
        style={{
          fontSize: 20,
          fontFamily: "SF-UI-medium",
          lineHeight: 20,
          color: isCurrent ? colors.text : colors.third,
          paddingLeft: 10,

          display: windowWidth < 1000 ? "none" : "flex",
        }}
      >
        {iconName}
      </Text>
    </View>
  );
};
