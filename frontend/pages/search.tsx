import React, { Component, useState, useEffect } from "react";
import {
  TextInput,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  YoutubeTime,
  isoFormatDMY,
  parseISOString,
  shorterText,
} from "../services/functions";
import Constants from "expo-constants";

import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

import { useTheme } from "@react-navigation/native";

export default SearchScreen = ({ navigation }) => {
  const { colors, dark } = useTheme();

  const site_api = "https://platform.x5gon.org/api/v2/";

  const [data, setData] = useState([]);

  const [inputValue, onChangeText] = useState("");
  const [previousInputValue, setPreviousValue] = useState("");
  const [nextPage, setNextPage] = useState("");

  const [loading, setLoading] = useState(false);

  const getData = (append_array) => {
    console.log(inputValue);
    setPreviousValue(inputValue);

    const search_link = site_api + "search?text=" + inputValue + "&types=video";
    fetch(append_array ? (nextPage ? nextPage : search_link) : search_link)
      .then((res) => res.json())
      .then((json) => {
        console.log("data returned");
        const new_arr = append_array
          ? data.concat(json.rec_materials)
          : json.rec_materials;
        console.log(new_arr.length);
        setData(new_arr);
        setNextPage(json.metadata.next_page);
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    if (previousInputValue !== inputValue) {
      setLoading(true);
      listflat.scrollToOffset(0);
      getData(false);
    }
  };

  //! only for faster dev
  useEffect(() => {
    onChangeText("machine");
  }, []);

  const loadMoreData = () => {
    console.log(nextPage);
    getData(true, nextPage);
  };

  const Separator = () => (
    <Text
      style={{
        color: "#5468fe",
      }}
    >
      {" "}
      |{" "}
    </Text>
  );
  const renderItem = ({ item }) => (
    <View style={styles.default_card}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Player", {
            screen: "Video",
            params: {
              videoID: item.views,
              title: item.title,
              video_url: {
                uri: item.url,
              },
            },
          });
          //videoRef.stopAsync();
        }}
        //key={item.title}
        style={styles.recommendation}
      >
        <Image
          source={{
            uri:
              "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fmarketingland.com%2Fwp-content%2Fml-loads%2F2015%2F01%2Fvideo-generic-ss-1920.jpg&f=1&nofb=1",
          }}
          style={{
            height: 90,
            maxWidth: (90 / 9) * 16,
            flex: 3,

            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            resizeMode: "cover",
          }}
        />
        <View style={{ flex: 4, padding: 6, alignContent: "center" }}>
          <Text style={[styles.h4]}>{shorterText(item.title, 60)}</Text>
          <View>
            <Text style={[styles.h5, { color: colors.primary }]}>
              {item.material_id}
              <Separator />
              {item.language}
              <Separator />
              {isoFormatDMY(parseISOString(item.creation_date))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  let listflat: any;

  const padding = 24;
  const styles = StyleSheet.create({
    container: {
      flex: 1,

      paddingTop: padding + Constants.statusBarHeight,
    },
    h1: {
      fontSize: 36,
      textAlign: "center",
      fontFamily: "SF-UI-semibold",
    },

    h3: {
      fontSize: 20,
      fontFamily: "SF-UI-medium",
    },
    h4: {
      fontSize: 14,
      fontFamily: "SF-UI-light",
      color: colors.text,
      paddingBottom: 2,
    },
    h5: {
      fontSize: 12,
      fontFamily: "SF-UI-medium",
    },

    gray: {
      color: "#828282",
    },
    recommendation: {
      flexDirection: "row",
    },
    SearchBar: {
      height: 70,

      backgroundColor: colors.card,
      borderRadius: 15,
      paddingLeft: 20,
      paddingRight: 10,

      marginHorizontal: padding,

      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,

      flexDirection: "row",
    },
    textinput: {
      height: 70,
      fontSize: 20,
      fontFamily: "SF-UI-medium",
      marginBottom: 20,
      color: dark ? "white" : "#838f92",

      flex: 1,
    },
    searchicon: {
      marginVertical: 10,

      width: 50,
      height: 50,
      borderRadius: 9,
      backgroundColor: "#5468ff",
      shadowColor: "rgba(84, 104, 255, 0.3)",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowRadius: 25,
      shadowOpacity: 1,

      justifyContent: "center",
    },
    default_card: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,

      marginTop: padding / 2,
      backgroundColor: colors.card,
      //padding: padding,
      borderRadius: 15,

      marginHorizontal: padding,
      maxWidth: 400,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.SearchBar}>
        <TextInput
          style={styles.textinput}
          onChangeText={(text) => onChangeText(text)}
          value={inputValue}
          autoFocus={true}
          onSubmitEditing={handleSubmit}
          clearButtonMode={"while-editing"}
          keyboardAppearance={dark ? "dark" : "light"}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <View style={styles.searchicon}>
            <Ionicons
              name={"ios-search"}
              size={30}
              style={{ paddingHorizontal: 12 }}
              color={"white"}
            />
          </View>
        </TouchableOpacity>
      </View>
      <SafeAreaView>
        <FlatList
          ref={(ref) => (listflat = ref)}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.material_id + item.url}
          onEndReached={loadMoreData}
          //getNativeScrollRef={(ref) => (flatlistRef = ref)}
          keyboardDismissMode={"on-drag"}
        />
      </SafeAreaView>
      {loading ? (
        <ActivityIndicator
          //? 15 is for centering - very hacky!!
          style={{
            left: width / 2 - 15,
            top: height / 2,
            position: "absolute",
          }}
          size="small"
        />
      ) : null}
    </View>
  );
};
