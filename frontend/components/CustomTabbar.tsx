import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomMenuItem } from "./CustomMenuIcon";

import { useTheme } from "@react-navigation/native";
import { color } from "react-native-reanimated";

const MAXIMUM_WIDTH = 600;

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { colors, dark } = useTheme();

  const totalWidth = useWindowDimensions().width;
  const totalHeight = useWindowDimensions().height;

  const [translateValue] = useState(new Animated.Value(0));

  const tabHeight = 100;

  const style = StyleSheet.create({
    tabContainer: {
      width: totalWidth,

      backgroundColor: colors.background,
      borderBottomLeftRadius: 14,
      borderBottomRightRadius: 14,
      elevation: 10,
      position: "absolute",
      top: 0,

      height: 70,
    },
  });

  return (
    <View style={[style.tabContainer, {}]}>
      <View style={{ margin: 14, position: "relative", left: 0 }}></View>
      <View
        style={{
          width: totalWidth,
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            maxWidth: 1000,
            flex: 1,
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityStates={isFocused ? ["selected"] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
                key={index}
              >
                <BottomMenuItem
                  iconName={label.toString()}
                  isCurrent={isFocused}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
