import React, { Component } from "react";
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
} from "../functions/functions/";

export default SearchScreen = ({ navigation }) => {
  const site_api = "https://platform.x5gon.org/api/v2/";

  const [data, setData] = React.useState([]);

  const [inputValue, onChangeText] = React.useState("");
  const handleSubmit = () => {
    console.log(inputValue);
    fetch(site_api + "search?text=" + inputValue + "&types=video")
      .then((res) => res.json())
      .then((json) => {
        setData(json.rec_materials);
        console.log("data set");
      });
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
          navigation.push("Video", {
            videoID: item.views,
            title: item.title,
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
            flex: 3,
            borderRadius: 12,
            resizeMode: "cover",
          }}
        />
        <View style={{ flex: 4, padding: 10, justifyContent: "center" }}>
          <Text style={styles.h5}>{item.title}</Text>
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
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => onChangeText(text)}
        value={inputValue}
        autoFocus={true}
        onSubmitEditing={handleSubmit}
      />
      <SafeAreaView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.title + item.material_id}
        />
      </SafeAreaView>
    </View>
  );
};

const padding = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
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
  video_title: {
    fontSize: 22,
    paddingBottom: 16,
    paddingTop: 16,
    fontFamily: "Inter_500Medium",
    paddingRight: 32,
  },
  description: {
    paddingVertical: 8,
  },
  recommendation: {
    paddingVertical: 8,
    flexDirection: "row",
  },
  your_notes: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    //height: 100,
    marginVertical: 16,
    backgroundColor: "#EB575725",
  },
  single_note: {
    paddingVertical: 6,
    /* borderBottomColor: "#4F4F4F25",
    borderBottomWidth: 1, */
  },
  note_text: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
    color: "#4F4F4F",
  },
});
