import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  SafeAreaView,
  ImageBackground,
} from "react-native";

import CarouselPlatform from "../components/Carousel";

import { shorterText } from "../services/functions";

import { useTheme } from "@react-navigation/native";

const EventList = ({ navigation, padding, events }) => {
  const { colors, dark } = useTheme();
  const { width, height } = useWindowDimensions();
  const eventHeight = 190;

  const cardWidth = width > 350 + 2 * padding ? 350 : width - 2 * padding;

  const EventCard = ({ item, index }: any) => (
    <View key={index}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Home", {
            screen: "event",
            params: {
              eventID: item.id,
              eventTitle: item.caption,
            },
          })
        }
        style={{ width: cardWidth, marginBottom: padding }}
        activeOpacity={0.75}
      >
        <ImageBackground
          source={{
            uri: item.image,
          }}
          style={{
            height: eventHeight,
            shadowColor: colors.shadow,
            shadowOffset: {
              width: 5,
              height: 6,
            },
            shadowRadius: 5,
            shadowOpacity: 0.5,
          }}
          imageStyle={{
            //maxHeight: 400,
            borderRadius: 15,
            resizeMode: "cover",
          }}
        >
          <View
            style={{
              width: "100%",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              bottom: 0,
              position: "absolute",
              padding: padding,
              backgroundColor: colors.background,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "SF-UI-medium",
                lineHeight: 20,
                color: colors.text,
              }}
            >
              {shorterText(item.caption, 30)}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  if (!events) return null;
  return (
    <SafeAreaView>
      <CarouselPlatform
        events={events}
        EventCard={EventCard}
        width={width}
        padding={padding}
        itemWidth={cardWidth}
      />
    </SafeAreaView>
  );
};

export default EventList;
