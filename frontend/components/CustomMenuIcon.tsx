import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

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
      return "home";
    } else if (name === "Profile") {
      return "user";
    } else if (name == "Search") {
      return "search";
    } else if (name == "DEV") {
      return "md-bug";
    } else if (name == "Player") {
      return "monitor";
    } else if (name === "Video") {
      return "compass";
    }
  };
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",
      }}
    >
      <Feather
        name={giveIconName(iconName)}
        size={26}
        style={{ color: isCurrent ? colors.primary : colors.third }}
      />
      <Text
        style={{
          fontSize: 20,
          fontFamily: "SF-UI-medium",
          lineHeight: 20,
          color: isCurrent ? colors.primary : colors.third,

          marginLeft: 10,

          display: windowWidth < 1000 ? "none" : "flex",
        }}
      >
        {iconName}
      </Text>
    </View>
  );
};
