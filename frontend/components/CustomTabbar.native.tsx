import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
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
  const totalWidth = Dimensions.get("window").width;
  const tabWidth =
    /* Math.min(totalWidth, MAXIMUM_WIDTH) */ totalWidth / state.routes.length;

  const animateSlider = (index: number) => {
    Animated.spring(translateValue, {
      toValue: index * tabWidth,
      velocity: 10,
      useNativeDriver: true,
      speed: 25,
    }).start();
  };

  useEffect(() => {
    animateSlider(state.index);
  }, [state.index]);

  const style = StyleSheet.create({
    tabContainer: {
      height: 45,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,
      backgroundColor: colors.card,
      borderTopRightRadius: 14,
      borderTopLeftRadius: 14,
      elevation: 10,
      position: "absolute",
      bottom: 0,
    },
    slider: {
      height: 5,
      position: "absolute",
      top: 0,
      left: 10,
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
  });

  return (
    <View
      style={[
        style.tabContainer,
        {
          width: totalWidth,
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
        <View style={{ flexDirection: "row" }}>
          <Animated.View
            style={[
              style.slider,
              {
                transform: [{ translateX: translateValue }],
                width: tabWidth - 20,
              },
            ]}
          />

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
              animateSlider(index);
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
