import React, { useState } from "react";

import { View, FlatList, Image } from "react-native";
import { useTheme } from "@react-navigation/native";

const WebFooter = () => {
  const { colors, dark } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        padding: 40,
        paddingBottom: 110,
        marginTop: 36,
      }}
    >
      <Image
        style={{
          height: 100,
          width: 400,
          borderRadius: 14,
          resizeMode: "contain",
        }}
        source={{
          uri:
            "https://static.videolectures.net/r.1483388978//custom/logoVLN_05_wsa.png",
        }}
      />
      <Image
        style={{
          height: 100,
          width: 400,
          borderRadius: 14,
          resizeMode: "contain",
        }}
        source={{
          uri:
            "http://hydro.videolectures.net/v00b/38/hb24rfwc34mlerim46yvapdekzi36nh5.png",
        }}
      />
    </View>
  );
};

export default WebFooter;
