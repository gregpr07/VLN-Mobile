import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
  Image,
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

  const [translateValue] = useState(new Animated.Value(0));
  const totalHeight = Dimensions.get("window").height;
  const tabHeight =
    /* Math.min(totalWidth, MAXIMUM_WIDTH) */ totalHeight / state.routes.length;

  const style = StyleSheet.create({
    tabContainer: {
      height: totalHeight,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,
      backgroundColor: colors.card,
      borderTopRightRadius: 14,
      borderBottomRightRadius: 14,
      elevation: 10,
      position: "absolute",
      //bottom: 0,
      left: 0,

      width: "10vw",
    },
  });

  return (
    <View
      style={[
        style.tabContainer,
        {
          height: totalHeight,
        },
      ]}
    >
      <View
      /*         style={{
          width: totalWidth,
          justifyContent: "center",
          maxWidth: MAXIMUM_WIDTH,
        }} */
      >
        <View style={{ flexDirection: "column" }}>
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
      <View
        style={{ margin: 14, position: "absolute", bottom: 0, width: "100%" }}
      >
        <Image
          source={
            dark
              ? require("../assets/icons/videolecture-net-dark.png")
              : require("../assets/icons/videolecture-net-light.png")
          }
          style={{
            width: "100%",
            height: 50,
            resizeMode: "contain",

            position: "absolute",
            bottom: 0,
          }}
        />
      </View>
    </View>
  );
};
