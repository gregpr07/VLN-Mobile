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
const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";

const padding = 24;
export default function VideosScreen({ navigation }: any) {
  /*   React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (videoreference) {
        console.log("not found");
      } else {
        console.log("found");
      }
    });

    return unsubscribe;
  }, [navigation]); */
  const Authors = () => {
    const recommendations = [
      {
        title:
          "This page - How Machine Learning has Finally Solved Wanamaker’s Dilemma",
        views: 12784,
        author: "Oliver Downs",
        date: "2016",
        image:
          "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
      },
      {
        title: "This page - How Machine ",
        views: 127123,
        author: "Oliver Downs",
        date: "2016",
        image:
          "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
      },
      {
        title: "Blabla video title ",
        views: 27312391,
        author: "Erik Novak",
        date: "201123",
        image:
          "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
      },
    ];
    const AUTHOR_HEIGHT = 80;
    const AUTHOR_WIDTH = (AUTHOR_HEIGHT / 9) * 16;
    const SEPARATOR_WIDTH = 20;
    const RenderAuthor = ({ item, index }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Player", {
            screen: "Video",
            params: {
              videoID: 10,
              title:
                "How Machine Learning has Finally Solved Wanamaker’s Dilemma",
            },
          })
        }
      >
        <View
          style={{
            paddingVertical: 6,
            width: AUTHOR_WIDTH,
            marginVertical: 10,
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
              height: AUTHOR_HEIGHT,
              borderRadius: 12,
              resizeMode: item.image ? "cover" : "center",
              marginBottom: 5,
            }}
          />
          <Text style={styles.h5}>{item.title}</Text>
          <Text>{item.author}</Text>
        </View>
      </TouchableOpacity>
    );

    const AuthorSeparator = () => (
      <View style={{ paddingRight: SEPARATOR_WIDTH }} />
    );
    return (
      <View
        style={{
          paddingVertical: 25,
          paddingHorizontal: padding,
        }}
      >
        <Text style={styles.h3}>Videos for you</Text>
        <SafeAreaView>
          <FlatList
            data={recommendations}
            renderItem={RenderAuthor}
            keyExtractor={(item) => item.title}
            ItemSeparatorComponent={AuthorSeparator}
            horizontal
            snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
          />
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View>
      <Authors />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
  },
  h1: {
    fontSize: 36,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },

  h3: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  h4: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
  h5: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },

  gray: {
    color: "#828282",
  },
  video_title: {
    fontSize: 22,
    paddingBottom: 16,
    paddingTop: 16,
    fontFamily: "Inter_500Medium",
    paddingRight: 32,
  },
  video: {
    borderRadius: 16,
    height: ((width - 2 * padding) / 16) * 9,
    width: width - 2 * padding,
  },
  description: {
    paddingVertical: 8,
  },
  recommendation: {
    paddingVertical: 8,
    flexDirection: "row",
  },
  your_notes: {
    borderRadius: 16,
    paddingHorizontal: 16,
    //height: 100,
    marginVertical: 8,
    backgroundColor: "white",
  },
  note_text: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
    color: "#4F4F4F",
  },
  button_default: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "#5DB075",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
});
