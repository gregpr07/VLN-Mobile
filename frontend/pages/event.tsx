import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import { noHeadFetcher } from "../services/fetcher";
import useSWR from "swr";

import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import Cats from "../components/CategoriesList";
import Lectures from "../components/LecturesList";
import AuthorList from "../components/AuthorList";

const padding = 12;

const Event = ({ navigation, route }: any) => {
  const { colors, dark } = useTheme();

  const { eventTitle, eventID } = route.params;

  const { data: eventinfo } = useSWR(`event/${eventID}`, noHeadFetcher);

  if (!eventinfo) {
    return null;
  }

  const styles = StyleSheet.create({
    viewPager: {
      flex: 1,
    },
    page: {
      justifyContent: "center",
      alignItems: "center",
    },
    h3: {
      fontSize: 17,
      fontFamily: "SF-UI-medium",
      color: colors.text,
      padding: padding,
    },
    default_card: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,

      marginBottom: padding,
      backgroundColor: colors.card,
      //padding: padding,
      borderRadius: 15,

      margin: padding,
      maxWidth: 500,

      flex: 1,
    },
  });

  const ListHeaderComponent = () => {
    return (
      <View
        style={{
          width: "100%",
          paddingHorizontal: 0,
        }}
      >
        <Image
          source={{
            uri: eventinfo.image,
          }}
          style={{
            height: 150,
            maxHeight: 250,
            resizeMode: "cover",
          }}
        />
        <View style={styles.default_card}>
          <Text style={styles.h3}>{eventinfo.description}</Text>
        </View>

        <AuthorList
          navigation={navigation}
          padding={padding}
          authors={eventinfo.authors}
          HeaderPadding={padding}
        />

        <Cats
          cats={eventinfo.categories}
          navigation={navigation}
          padding={padding}
          HeaderPadding={padding}
        />
      </View>
    );
  };

  return (
    <Lectures
      navigation={navigation}
      HeaderComponent={ListHeaderComponent}
      padding={padding}
      styles={styles}
      //lectures={category.lectures}
      fetchurl=""
      default_lectures={eventinfo.lectures}
    />
  );
};

export default Event;
