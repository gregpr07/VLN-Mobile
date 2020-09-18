import React, { Component, useState } from "react";
import {
  TextInput,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  YoutubeTime,
  isoFormatDMY,
  parseISOString,
  shorterText,
} from "../services/functions";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

export default SearchScreen = ({ navigation }) => {
  const site_api = "https://platform.x5gon.org/api/v2/";

  const [data, setData] = useState([]);

  const [inputValue, onChangeText] = useState("");
  const [previousInputValue, setPreviousValue] = useState("");
  const [nextPage, setNextPage] = useState("");

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
      });
  };

  const handleSubmit = () => {
    if (previousInputValue !== inputValue) {
      getData(false);
    }
  };

  const loadMoreData = () => {
    console.log(nextPage);
    getData(true, nextPage);
  };

  const Separator = () => (
    <Text
      style={{
        color: "#6FCF97",
      }}
    >
      {" "}
      |{" "}
    </Text>
  );
  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 12,
        shadowOffset: {
          width: 6,
          height: 3,
        },
        shadowOpacity: 0.075,
        shadowRadius: 2,
      }}
    >
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
              "http://hydro.ijs.si/v013/2a/fil6y2o3eazawewmlpi4gg4osoodvfbz.jpg",
          }}
          style={{
            height: 90,
            maxWidth: (90 / 9) * 16,
            flex: 3,
            borderRadius: 12,
            resizeMode: "cover",
          }}
        />
        <View
          style={{ flex: 4, paddingHorizontal: 10, justifyContent: "center" }}
        >
          <Text style={styles.h5}>{shorterText(item.title, 60)}</Text>
          <View style={styles.description}>
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
      <StatusBar style="dark" />
    </View>
  );
};

const padding = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
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
    fontSize: 18,
    fontFamily: "SF-UI-medium",
  },
  h5: {
    fontSize: 16,
    fontFamily: "SF-UI-medium",
  },
  gray: {
    color: "#828282",
  },
  recommendation: {
    marginVertical: 12,
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
  },
});
