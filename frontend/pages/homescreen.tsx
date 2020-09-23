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

  const EventCard = ({ item, index }: any) => (
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
      <Text
        style={[styles.h1, { paddingHorizontal: padding, paddingBottom: 10 }]}
      >
        Events
      </Text>
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

    const AUTHOR_WIDTH = 100;
    const SEPARATOR_WIDTH = 10;
    const RenderAuthor = ({ item, index }) => (
      <View
        style={{
          //paddingVertical: 6,
          width: AUTHOR_WIDTH,
          marginTop: 10,
        }}
      >
        <View
          style={{
            shadowColor: "rgba(0, 0, 0, 0.09)",
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

              borderColor: "white",
              borderWidth: 4,
            }}
          />
        </View>
        <Text style={styles.h5}>{item.name}</Text>
      </View>
    );

    const AuthorSeparator = () => (
      <View style={{ paddingRight: SEPARATOR_WIDTH }} />
    );
    return (
      <View
        style={{
          marginTop: 30,

          marginBottom: 30,
        }}
      >
        <View style={{ flexDirection: "row", marginHorizontal: padding }}>
          <Text style={[styles.h3, { flex: 1 }]}>Top authors</Text>
          <Text style={[styles.h3, { color: "#5468ff" }]}>Show all</Text>
        </View>

        <SafeAreaView>
          <FlatList
            data={authors}
            ListHeaderComponent={() => (
              <View style={{ paddingLeft: padding }} />
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
      </View>
    );
  };

  const Categories = () => {
    const cats = [
      {
        name: "computer science",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F385%2F812%2Foriginal%2Fillustration-of-characters-and-computer-science-concept-vector.jpg&f=1&nofb=1",
      },
      {
        name: "mathematics",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F155%2F609%2Fnon_2x%2Ffree-vector-illustration-about-mathematics.jpg&f=1&nofb=1",
      },
      {
        name: "physics",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fsymbols-of-physics-vector-id174160850%3Fk%3D6%26m%3D174160850%26s%3D612x612%26w%3D0%26h%3D_VZkZAhx6MHcnXQkJZwrsTZf2Pbp42ThxybIogrFDCQ%3D&f=1&nofb=1",
      },
      {
        name: "social sciences",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fst.depositphotos.com%2F1845839%2F4823%2Fv%2F950%2Fdepositphotos_48230925-stock-illustration-word-cloud-social-science.jpg&f=1&nofb=1",
      },
    ];

    const CAT_WIDTH = 130;

    const RenderCategory = ({ item, index }: any) => (
      <View
        style={{
          width: CAT_WIDTH,
          borderRadius: 8,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(60, 128, 209, 0.09)",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowRadius: 19,
          shadowOpacity: 1,

          marginTop: 10,
          marginBottom: 30,
        }}
      >
        <Image
          source={{
            uri: item.image,
          }}
          style={{
            width: "100%",
            height: 75,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            resizeMode: "cover",
            marginBottom: 5,
          }}
        />
        <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text
            style={{
              fontSize: 14,

              fontFamily: "SF-UI-medium",
              letterSpacing: 0,
            }}
          >
            {item.name}
          </Text>
        </View>
      </View>
    );

    return (
      <View
        style={
          {
            //paddingHorizontal: padding,
          }
        }
      >
        <View style={{ flexDirection: "row", paddingHorizontal: padding }}>
          <Text style={[styles.h3, { flex: 1 }]}>Categories</Text>
          <Text style={[styles.h3, { color: "#5468ff" }]}>Show all</Text>
        </View>
        {/* CANT GET THIS TO WORK FROM LEFT */}
        {/*         <SafeAreaView>
          <Carousel
            data={cats}
            renderItem={RenderCategory}
            sliderWidth={width}
            itemWidth={CAT_WIDTH}
            //layout={"stack"}
          />
        </SafeAreaView> */}
        <SafeAreaView>
          <FlatList
            data={cats}
            renderItem={RenderCategory}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={() => <View style={{ marginLeft: 10 }} />}
            horizontal
            ListHeaderComponent={() => (
              <View style={{ paddingLeft: padding }} />
            )}
            snapToInterval={CAT_WIDTH + 10}
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
      <Categories />
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
    lineHeight: 20,
  },
  h4: {
    fontSize: 18,
    fontFamily: "SF-UI-light",
    lineHeight: 20,
  },
  h5: {
    fontSize: 16,
    fontFamily: "SF-UI-medium",
    textAlign: "center",
  },

  gray: {
    color: "#828282",
  },
  description: {
    paddingVertical: 8,
  },
  default_card: {
    shadowColor: "rgba(60, 128, 209, 0.09)",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 19,
    shadowOpacity: 1,

    marginTop: padding,
    backgroundColor: "white",
    padding: padding,
    borderRadius: 12,
  },
});
