import React from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";

import { useTheme } from "@react-navigation/native";

const Categories = ({ cats, navigation, padding, HeaderPadding = 0 }: any) => {
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
      ListHeaderComponent={() => (
        <View style={{ paddingLeft: HeaderPadding }} />
      )}
      ItemSeparatorComponent={() => <View style={{ marginLeft: padding }} />}
      horizontal
      //snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
      showsHorizontalScrollIndicator={false}
      decelerationRate={0}
    />
  );
};

export default Categories;
