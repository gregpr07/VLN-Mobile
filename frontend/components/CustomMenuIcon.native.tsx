import React from "react";
import { View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

type Props = {
  iconName: string;
  isCurrent?: boolean;
};

import { useTheme } from "@react-navigation/native";

export const BottomMenuItem = ({ iconName, isCurrent }: Props) => {
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
        paddingTop: 8,
      }}
    >
      <Feather
        name={giveIconName(iconName)}
        size={26}
        style={{ color: isCurrent ? colors.text : colors.third }}
      />
    </View>
  );
};
