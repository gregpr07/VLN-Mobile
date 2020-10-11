import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import { noHeadFetcher } from "../services/fetcher";
import useSWR from "swr";

import { useTheme } from "@react-navigation/native";

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
  });

  return (
    <View>
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

        <Text style={styles.h3}>{eventinfo.description}</Text>
      </View>
    </View>
  );
};

export default Event;
