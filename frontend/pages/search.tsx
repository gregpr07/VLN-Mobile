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
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default SearchScreen = ({ navigation }) => {
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
            <Text style={[styles.h5, { color: "#828282" }]}>
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.SearchBar}
        onChangeText={(text) => onChangeText(text)}
        value={inputValue}
        autoFocus={true}
        onSubmitEditing={handleSubmit}
        clearButtonMode={"while-editing"}
      />
      <SafeAreaView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.material_id + item.url}
          onEndReached={loadMoreData}
          //getNativeScrollRef={(ref) => (flatlistRef = ref)}
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
      <StatusBar style="dark" />
    </View>
  );
};

const padding = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1,

    //backgroundColor: "white",
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
    height: 60,
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 20,
    fontFamily: "SF-UI-medium",
    marginBottom: 20,
    color: "#838f92",

    marginHorizontal: padding,
  },
  default_card: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    marginTop: padding / 2,
    backgroundColor: "white",
    //padding: padding,
    borderRadius: 12,

    marginHorizontal: padding,
  },
});
