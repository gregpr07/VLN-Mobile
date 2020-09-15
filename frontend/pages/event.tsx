import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const Event = ({ navigation }: any) => {
  const [eventinfo, setEventInfo] = useState();
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
            uri:
              "https://www.tp-lj.si/imagine_cache/news_figure/uploads/open-data_600x315.jpg",
          }}
          style={{
            height: 200,
            maxHeight: 400,
            resizeMode: "cover",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Event;
