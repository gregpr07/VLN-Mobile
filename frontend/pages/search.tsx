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
  Button,
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

import { BASEURL } from "../services/fetcher";

import { connect } from "react-redux";
import { setVideoID } from "../services/actions";

let CURRENT_PAGE_LEC: number;
let LOADED_ALL_LEC: boolean;

const SearchScreen = ({
  navigation,
  videoID,
  setVidID,
  videoRef,
  audioRef,
}: any) => {
  const { colors, dark } = useTheme();

  const [lecture, setLectures] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [inputValue, onChangeText] = useState("");
  const [previousInputValue, setPreviousValue] = useState("");

  const [loading, setLoading] = useState(false);

  // BASEURL + "esearch/search/lecture/erik%20novak/0/"

  async function getData(append_array: boolean) {
    setPreviousValue(inputValue);

    const search_link = `${BASEURL}esearch/search/lecture/${inputValue}/${CURRENT_PAGE_LEC}/`;
    fetch(search_link)
      .then((res) => res.json())
      .then((json) => {
        console.log("data returned on link: " + search_link);

        const new_arr = append_array
          ? lecture.concat(json.lectures)
          : json.lectures;
        setLectures(new_arr);
        setLoading(false);
        if (json.lectures === []) {
          LOADED_ALL_LEC = true;
        }
      });
  }

  async function getDataAut(append_array: boolean) {
    if (inputValue) {
      const search_link = `${BASEURL}esearch/search/author/${inputValue}/0/`;
      fetch(search_link)
        .then((res) => res.json())
        .then((json) => {
          console.log("data returned on link: " + search_link);

          const new_arr = append_array
            ? authors.concat(json.authors)
            : json.authors;
          setAuthors(new_arr);
          setLoading(false);
        });
    }
  }

  const handleSubmit = () => {
    if (previousInputValue !== inputValue) {
      CURRENT_PAGE_LEC = 0;
      LOADED_ALL_LEC = false;
      setLoading(true);
      listflat.scrollToOffset(0);
      getData(false);
      getDataAut(false);
    }
  };

  //! only for faster dev
  useEffect(() => {
    onChangeText("machine");
  }, []);

  async function loadMoreLecs() {
    if (!LOADED_ALL_LEC) {
      CURRENT_PAGE_LEC++;
      getData(true);
    }
  }

  const _handleResultsClick = async (item) => {
    if (videoRef) {
      await videoRef.unloadAsync();
      await audioRef.unloadAsync();
    }

    setVidID(item.id);
    navigation.navigate("Player", {
      screen: "Video",
    });
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
  const renderItem = ({ item }: any) => (
    <View style={styles.default_card}>
      <TouchableOpacity
        onPress={() => _handleResultsClick(item)}
        //key={item.title}
        style={styles.recommendation}
      >
        <Image
          source={{
            uri: item.thumbnail,
          }}
          style={{
            height: 80,
            maxWidth: (80 / 9) * 16,
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
              {item.author}
              <Separator />
              {item.views}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const Authors = () => {
    const AUTHOR_WIDTH = 100;
    const SEPARATOR_WIDTH = 10;
    const RenderAuthor = ({ item, index }) => (
      <View
        style={{
          //paddingVertical: 6,
          width: AUTHOR_WIDTH,
          marginTop: 14,
        }}
      >
        <View
          style={{
            shadowColor: colors.shadow,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowRadius: 19,
            shadowOpacity: 1,

            borderRadius: AUTHOR_WIDTH,
          }}
        >
          <Image
            source={
              item.image
                ? {
                    uri: item.image,
                  }
                : require(`../assets/icons/profile_image.png`)
            }
            style={{
              height: AUTHOR_WIDTH,
              width: AUTHOR_WIDTH,
              borderRadius: AUTHOR_WIDTH,

              resizeMode: "cover",

              marginBottom: 5,

              borderColor: colors.card,
              borderWidth: 4,
            }}
          />
        </View>
        <Text style={[styles.h3, { color: colors.text, height: 34 }]}>
          {item.name}
        </Text>
      </View>
    );

    const AuthorSeparator = () => (
      <View style={{ paddingRight: SEPARATOR_WIDTH }} />
    );
    if (!authors) {
      return null;
    }

    return (
      <View
        style={
          {
            //marginVertical: padding,
          }
        }
      >
        <SafeAreaView>
          <FlatList
            data={authors}
            ListHeaderComponent={() => (
              <View style={{ paddingLeft: padding }} />
            )}
            ListFooterComponent={() => (
              <View style={{ paddingRight: padding }} />
            )}
            renderItem={RenderAuthor}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={AuthorSeparator}
            horizontal
            snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
          />
        </SafeAreaView>
      </View>
    );
  };

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
      fontSize: 14,
      fontFamily: "SF-UI-semibold",
      textAlign: "center",
    },
    h4: {
      paddingBottom: 2,
      fontSize: 14,
      fontFamily: "SF-UI-medium",
      color: colors.text,
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
      lineHeight: 25,
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

      {/* <Authors /> */}
      {/* {lecture ? ( */}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={(ref) => (listflat = ref)}
          data={lecture}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreLecs}
          ListHeaderComponent={<Authors />}
          ListFooterComponent={() => <View style={{ marginBottom: padding }} />}
          //getNativeScrollRef={(ref) => (flatlistRef = ref)}
          keyboardDismissMode={"on-drag"}
        />
      </View>
      {/* ) : null} */}

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

const mapStateToProps = (state) => ({
  videoID: state.video.videoID,
  videoRef: state.video.videoRef,
  audioRef: state.video.audioRef,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
