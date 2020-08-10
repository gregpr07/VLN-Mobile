import React, { useState } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";

const padding = 24;
export default function HomeScreen() {
  const events = [
    {
      id: "1",
    },
    {
      id: "2",
    },
    {
      id: "3",
    },
  ];

  const EventCard = () => (
    <View
      style={{
        shadowOffset: {
          width: 0,
          height: 9,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        width: width,
        paddingHorizontal: padding,
      }}
    >
      <Image
        source={{
          uri:
            "https://www.tp-lj.si/imagine_cache/news_figure/uploads/open-data_600x315.jpg",
        }}
        style={{
          height: ((width - 2 * padding) / 16) * 9,
          borderRadius: 12,
          resizeMode: "cover",
          marginVertical: 24,
        }}
      />
    </View>
  );
  return (
    <View>
      <View
        style={{
          paddingTop: Constants.statusBarHeight,
          backgroundColor: "#5DB075",
          paddingBottom: 10,
        }}
      >
        <Text style={styles.h1}>Events</Text>
        <SafeAreaView>
          <FlatList
            data={events}
            renderItem={EventCard}
            keyExtractor={(item) => item.id}
            horizontal
            snapToInterval={width}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
          />
        </SafeAreaView>
      </View>
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
    fontSize: 16,
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
