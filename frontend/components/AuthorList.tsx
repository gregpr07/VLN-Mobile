import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";

import { useTheme } from "@react-navigation/native";

const Authors = ({ padding, navigation, authors, HeaderPadding = 0 }) => {
  const { colors, dark } = useTheme();

  const AUTHOR_WIDTH = 100;
  const SEPARATOR_WIDTH = padding;
  const RenderAuthor = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Home", {
          screen: "author",
          params: {
            authorID: item.id,
          },
        })
      }
      style={{
        //paddingVertical: 6,
        width: AUTHOR_WIDTH,
        marginTop: 10,
      }}
    >
      <View
        style={{
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowRadius: 19,
          shadowOpacity: 1,

          borderRadius: AUTHOR_WIDTH,
        }}
      >
        <Image
          source={
            item.image
              ? {
                  uri: item.image,
                }
              : require(`../assets/icons/profile_image.png`)
          }
          style={{
            height: AUTHOR_WIDTH,
            width: AUTHOR_WIDTH,
            borderRadius: AUTHOR_WIDTH,

            resizeMode: "cover",

            marginBottom: 5,
          }}
        />
      </View>
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          fontFamily: "SF-UI-medium",
          textAlign: "center",
          height: 32,
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const AuthorSeparator = () => (
    <View style={{ paddingRight: SEPARATOR_WIDTH }} />
  );

  if (!authors) {
    return null;
  }

  return (
    <SafeAreaView>
      <FlatList
        data={authors.filter((aut) => aut.name !== "none")}
        ListHeaderComponent={() => (
          <View style={{ paddingLeft: HeaderPadding }} />
        )}
        renderItem={RenderAuthor}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={AuthorSeparator}
        horizontal
        snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
      />
    </SafeAreaView>
  );
};

export default Authors;
