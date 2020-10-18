import React, { useState } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";

// expo
import Constants from "expo-constants";

/* // @ts-ignore
import Carousel from "react-native-snap-carousel"; */

import { ScrollView } from "react-native-gesture-handler";

import { useTheme } from "@react-navigation/native";

import { noHeadFetcher } from "../services/fetcher";
import useSWR from "swr";

//import { color } from "react-native-reanimated";

const padding = 24;
export default function HomeScreen({ navigation }: any) {
  const { colors, dark } = useTheme();

  const { data: events } = useSWR("event/", noHeadFetcher);
  const { data: authors_most_viewd } = useSWR(
    "author/most_viewed/",
    noHeadFetcher
  );

  const { width, height } = useWindowDimensions();
  const eventHeight = 190;

  const EventCard = ({ item, index }: any) => (
    <View key={index}>
      <TouchableOpacity
        onPress={() =>
          navigation.push("event", {
            eventID: item.id,
            eventTitle: item.title,
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
            //maxHeight: 400,
            borderRadius: 12,
            resizeMode: "cover",
            //marginVertical: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const Header = () =>
    events ? (
      <View>
        <Text
          style={[
            styles.h1,
            {
              paddingHorizontal: padding,
              paddingBottom: 10,
              color: colors.text,
            },
          ]}
        >
          Events
        </Text>
        <SafeAreaView>
          <Carousel
            data={events.results}
            renderItem={EventCard}
            sliderWidth={width}
            itemWidth={width > 350 + 2 * padding ? 350 : width - 2 * padding}
            //layout={"stack"}
            layout={"stack"}
            activeSlideAlignment="start"
            containerCustomStyle={{
              paddingStart: padding,
            }}
          />
        </SafeAreaView>
      </View>
    ) : null;

  const Authors = () => {
    const AUTHOR_WIDTH = 100;
    const SEPARATOR_WIDTH = 10;
    const RenderAuthor = ({ item, index }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.push("author", {
            authorID: item.id,
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

              borderColor: colors.card,
              borderWidth: 4,
            }}
          />
        </View>
        <Text style={[styles.h5, { color: colors.text }]}>{item.name}</Text>
      </TouchableOpacity>
    );

    const AuthorSeparator = () => (
      <View style={{ paddingRight: SEPARATOR_WIDTH }} />
    );

    if (!authors_most_viewd) {
      return null;
    }

    return (
      <View
        style={{
          marginTop: 30,
        }}
      >
        <View style={{ flexDirection: "row", marginHorizontal: padding }}>
          <Text style={[styles.h3, { flex: 1, color: colors.text }]}>
            Top authors
          </Text>
          <Text style={[styles.h3, { color: colors.secondary }]}>Show all</Text>
        </View>

        <SafeAreaView>
          <FlatList
            data={authors_most_viewd.results}
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
        id: 13,
      },
      {
        name: "mathematics",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F155%2F609%2Fnon_2x%2Ffree-vector-illustration-about-mathematics.jpg&f=1&nofb=1",
        id: 23,
      },
      {
        name: "physics",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fsymbols-of-physics-vector-id174160850%3Fk%3D6%26m%3D174160850%26s%3D612x612%26w%3D0%26h%3D_VZkZAhx6MHcnXQkJZwrsTZf2Pbp42ThxybIogrFDCQ%3D&f=1&nofb=1",
        id: 58,
      },
      {
        name: "social sciences",
        image:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fst.depositphotos.com%2F1845839%2F4823%2Fv%2F950%2Fdepositphotos_48230925-stock-illustration-word-cloud-social-science.jpg&f=1&nofb=1",
        id: 611,
      },
    ];

    const CAT_WIDTH = 130;

    const RenderCategory = ({ item, index }: any) => (
      <View
        style={{
          width: CAT_WIDTH,
          borderRadius: 8,
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
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
        <TouchableOpacity
          onPress={() => navigation.push("category", { categoryID: item.id })}
        >
          <>
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
                  color: colors.text,
                }}
              >
                {item.name}
              </Text>
            </View>
          </>
        </TouchableOpacity>
      </View>
    );

    return (
      <View
        style={{
          //paddingHorizontal: padding,
          marginTop: 30,
        }}
      >
        <View style={{ flexDirection: "row", paddingHorizontal: padding }}>
          <Text style={[styles.h3, { flex: 1, color: colors.text }]}>
            Categories
          </Text>
          <Text style={[styles.h3, { color: colors.secondary }]}>Show all</Text>
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
        marginTop: Constants.statusBarHeight + 6,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/*  <Header /> */}
      <Authors />
      <Categories />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
