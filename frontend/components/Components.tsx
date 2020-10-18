import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

import { useTheme } from "@react-navigation/native";

export const ActivityView = ({ color }) => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export const Categories = ({ cats, navigation, padding }: any) => {
  const { colors, dark } = useTheme();
  const Cat = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Home", {
          screen: "category",
          params: {
            categoryID: item.id,
          },
        })
      }
    >
      <View
        style={{
          flex: 1,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowRadius: 19,
          shadowOpacity: 1,

          backgroundColor: colors.card,

          marginTop: padding,

          padding: padding,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: colors.secondary,
            fontFamily: "SF-UI-medium",
            fontSize: 16,
          }}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <FlatList
      data={cats}
      renderItem={Cat}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View style={{ marginLeft: padding }} />}
      horizontal
      //snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
      showsHorizontalScrollIndicator={false}
      decelerationRate={0}
    />
  );
};
