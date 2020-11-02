import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";

// expo
import Constants from "expo-constants";

import { ScrollView } from "react-native-gesture-handler";

import { useTheme } from "@react-navigation/native";

import { noHeadFetcher } from "../services/fetcher";
import useSWR from "swr";

import { HeaderText } from "../components/TextHeader";

import AuthorList from "../components/AuthorList";
import EventList from "../components/EventList";
import Container from "../components/Container";

//import { color } from "react-native-reanimated";

const padding = 14;
export default function HomeScreen({ navigation }: any) {
  const { colors, dark } = useTheme();

  const { data: events } = useSWR("event/", noHeadFetcher);
  const { data: authors_most_viewd } = useSWR(
    "author/most_viewed/",
    noHeadFetcher
  );

  const Header = () =>
    events ? (
      <View>
        <HeaderText text="Home" />
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: padding,
            paddingBottom: 8,
          }}
        >
          <Text style={[styles.h3, { flex: 1, color: colors.text }]}>
            Events
          </Text>
          <Text style={[styles.h3, { color: colors.secondary }]}>Show all</Text>
        </View>
        <EventList
          events={events.results}
          padding={padding}
          navigation={navigation}
        />
      </View>
    ) : null;

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
    <Container>
      <ScrollView
        style={{
          marginTop: Constants.statusBarHeight,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        {authors_most_viewd ? (
          <View
            style={{
              marginTop: 30 - padding,
            }}
          >
            <View style={{ flexDirection: "row", marginHorizontal: padding }}>
              <Text style={[styles.h3, { flex: 1, color: colors.text }]}>
                Top authors
              </Text>
              {/*             <Text style={[styles.h3, { color: colors.secondary }]}>
              Show all
            </Text> */}
            </View>
            <AuthorList
              navigation={navigation}
              padding={padding}
              authors={authors_most_viewd.results}
              HeaderPadding={padding}
            />
          </View>
        ) : null}
        <Categories />
      </ScrollView>
    </Container>
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
