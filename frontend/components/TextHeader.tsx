import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";

import { useTheme } from "@react-navigation/native";

const padding = 14;
export const HeaderText = ({ text }) => {
  const { colors, dark } = useTheme();
  return (
    <Text
      style={{
        fontSize: 36,
        fontFamily: "SF-UI-bold",
        color: colors.text,
        paddingHorizontal: padding,
        paddingBottom: 10,
        paddingTop: padding,
      }}
    >
      {text}
    </Text>
  );
};
