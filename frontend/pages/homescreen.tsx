import React, { useState } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
const { width, height } = Dimensions.get("window");

// expo
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

//import ViewPager from "@react-native-community/viewpager";

// @ts-ignore
import Carousel from "react-native-snap-carousel";

import { ScrollView } from "react-native-gesture-handler";

const padding = 24;
export default function HomeScreen({ navigation }: any) {
  type events = Array<{ id: string; image: string }>;
  const events: events = [
    {
      id: "1",
      image:
        "https://www.tp-lj.si/imagine_cache/news_figure/uploads/open-data_600x315.jpg",
    },
    {
      id: "2",
      image: "http://hydro.ijs.si/v00a/5e/lyuqcgce6wrwiu3c2mxu3ont3jtte6fe.jpg",
    },
    {
      id: "3",
      image: "http://hydro.ijs.si/v00a/c3/ynn57ohwub3ifoj6heyav2akwjxy5m27.jpg",
    },
  ];

  const eventHeight = (width / 16) * 7;

  const EventCard = ({ item, index }) => (
    <View key={index}>
      <TouchableOpacity
        onPress={() =>
          navigation.push("event", {
            videoID: 10,
            title:
              "How Machine Learning has Finally Solved Wanamaker’s Dilemma",
          })
        }
        activeOpacity={0.75}
      >
        <Image
          source={{
            uri: item.image,
          }}
          style={{
            height: eventHeight, // - 2 * padding
            maxHeight: 400,
            borderRadius: 12,
            resizeMode: "cover",
            //marginVertical: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const Header = () => (
    <View>
      <Text style={[styles.h1, { paddingHorizontal: padding }]}>Events</Text>
      <SafeAreaView>
        <Carousel
          data={events}
          renderItem={EventCard}
          sliderWidth={width}
          itemWidth={width - 2 * padding}
          //layout={"stack"}
        />
      </SafeAreaView>
    </View>
  );

  const Authors = () => {
    const authors = [
      {
        name: "Walter Lewin",
        views: 3813440,
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F4a0FbQdH3dY%2Fmaxresdefault.jpg&f=1&nofb=1",
      },
      {
        name: "Gilbert Strang",
        views: 1020442,
        image:
          "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.maths.unsw.edu.au%2Fsites%2Fdefault%2Ffiles%2Fgilbert_strang.jpg&f=1&nofb=1",
      },
      {
        name: "Erik Novak",
        views: 12314155,
        image: "",
      },
    ];

    const AUTHOR_WIDTH = 120;
    const SEPARATOR_WIDTH = 20;
    const RenderAuthor = ({ item, index }) => (
      <View
        style={{
          //paddingVertical: 6,
          width: AUTHOR_WIDTH,
          marginTop: 10,
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
            borderRadius: 12,
            resizeMode: item.image ? "cover" : "center",
            marginBottom: 5,
          }}
        />
        <Text style={styles.h5}>{item.name}</Text>
        <Text>
          <Text
            style={{
              fontFamily: "SF-UI-medium",
            }}
          >
            {item.views}
          </Text>{" "}
          views
        </Text>
      </View>
    );

    const AuthorSeparator = () => (
      <View style={{ paddingRight: SEPARATOR_WIDTH }} />
    );
    return (
      <View
        style={{
          paddingTop: 15,
          paddingHorizontal: padding,
        }}
      >
        <Text style={styles.h3}>Top authors</Text>
        <SafeAreaView>
          <FlatList
            data={authors}
            renderItem={RenderAuthor}
            keyExtractor={(item) => item.name}
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
    <ScrollView
      style={{
        marginTop: Constants.statusBarHeight,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <Authors />
      <Authors />
      <StatusBar style="dark" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Constants.statusBarHeight,
  },
  h1: {
    fontSize: 36,
    textAlign: "left",
    fontFamily: "SF-UI-semibold",
  },

  h3: {
    fontSize: 20,
    fontFamily: "SF-UI-medium",
  },
  h4: {
    fontSize: 18,
    fontFamily: "SF-UI-light",
  },
  h5: {
    fontSize: 16,
    fontFamily: "SF-UI-medium",
  },

  gray: {
    color: "#828282",
  },
  description: {
    paddingVertical: 8,
  },
});
