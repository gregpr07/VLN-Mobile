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
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Video", {
            screen: "Video",
            params: {
              videoID: item.views,
              title: item.title,
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
          <Text style={styles.h5}>{shorterText(item.title, 75)}</Text>
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
    backgroundColor: "white",
    paddingTop: padding + Constants.statusBarHeight,
  },
  h1: {
    fontSize: 36,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
  },

  h3: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  h4: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
  h5: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  gray: {
    color: "#828282",
  },
  recommendation: {
    marginVertical: 12,
    flexDirection: "row",
  },
  SearchBar: {
    height: 50,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    paddingHorizontal: 20,
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    marginBottom: 20,
    color: "#BDBDBD",
  },
});
