import React, { Component, useState, useEffect, useRef } from "react";
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
  Animated,
  Platform,
} from "react-native";
import { shorterText, numberWithCommas } from "../services/functions";

import Constants from "expo-constants";

import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

import { HeaderText } from "../components/TextHeader";

import { useTheme } from "@react-navigation/native";

import { API } from "../services/fetcher";

import { connect } from "react-redux";
import { setVideoID } from "../services/storage/actions";

import Cats from "../components/CategoriesList";
import AuthorList from "../components/AuthorList";
import EventList from "../components/EventList";
import Container from "../components/Container";

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

  //! NOT USING BECAUSE FLATLIST DOESN'T SUPPORT CHANGING ON THE FLY
  //const { width, height } = useWindowDimensions();

  const [lecture, setLectures] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);

  const [inputValue, onChangeText] = useState("");
  const [previousInputValue, setPreviousValue] = useState("");

  const [loading, setLoading] = useState(false);

  // BASEURL + "esearch/search/lecture/erik%20novak/0/"

  async function getData(append_array: boolean) {
    setPreviousValue(inputValue);

    const search_link = `${API}search/lecture/${inputValue}/${CURRENT_PAGE_LEC}/`;
    fetch(search_link)
      .then((res) => res.json())
      .then((json) => {
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

  async function getDataOther(append_array: boolean) {
    const fetchAndSet = (urlSearch: string, setHook: any, object: string) => {
      fetch(`${API}search/${urlSearch}/${inputValue}/0/`)
        .then((res) => res.json())
        .then((json) => {
          setHook(json[object]);
          setLoading(false);
        });
    };
    if (inputValue) {
      fetchAndSet("category", setCategories, "categories");
      fetchAndSet("author", setAuthors, "authors");
      fetchAndSet("event", setEvents, "events");
    }
  }

  const handleSubmit = () => {
    if (previousInputValue !== inputValue) {
      CURRENT_PAGE_LEC = 0;
      LOADED_ALL_LEC = false;
      setLoading(true);
      listflat.current.scrollToOffset(0);
      //console.log(listflat);
      getData(false);
      getDataOther(false);
    }
  };

  /*   //! only for faster dev
  useEffect(() => {
    onChangeText("complex");
  }, []); */

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
          source={
            item.thumbnail
              ? {
                  uri: item.thumbnail,
                }
              : dark
              ? require("../assets/icons/videolecture-net-dark.png")
              : require("../assets/icons/videolecture-net-light.png")
          }
          style={{
            height: 80,
            maxWidth: (80 / 9) * 16,
            flex: 3,

            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            resizeMode: item.thumbnail ? "cover" : "contain",
          }}
        />
        <View style={{ flex: 4, padding: 6, alignContent: "center" }}>
          <Text style={[styles.h4]}>{shorterText(item.title, 75)}</Text>
          <View>
            <Text style={[styles.h5, { color: colors.secondary }]}>
              {item.author}
              <Separator />
              {numberWithCommas(item.views)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View style={{ paddingTop: 50 }}>
      {events ? (
        <EventList events={events} padding={padding} navigation={navigation} />
      ) : null}

      <AuthorList
        authors={authors}
        padding={padding}
        navigation={navigation}
        HeaderPadding={padding}
      />
      <View style={{ paddingBottom: padding }}>
        <Cats
          cats={categories}
          navigation={navigation}
          padding={padding}
          HeaderPadding={padding}
        />
      </View>
    </View>
  );

  const padding = 14;
  const styles = StyleSheet.create({
    container: {
      flex: 1,

      paddingTop: Constants.statusBarHeight,
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
      fontSize: 14,
      fontFamily: "SF-UI-semibold",
    },

    gray: {
      color: "#828282",
    },
    recommendation: {
      flexDirection: "row",
    },
    SearchBar: {
      height: 70,

      marginTop: padding / 2,

      width: Platform.OS === "web" ? "95%" : width - 2 * padding,

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
      shadowRadius: 15,
      shadowOpacity: 1,

      flexDirection: "row",

      // position: "absolute",  // do not set it to absolute, this breaks it on Android
    },
    textinput: {
      height: 70,
      fontSize: 20,
      lineHeight: 25,
      fontFamily: "SF-UI-medium",
      marginBottom: 20,
      color: dark ? "white" : "#838f92",

      flex: 1,
      zIndex: 1,
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

      marginBottom: padding,
      backgroundColor: colors.card,
      //padding: padding,
      borderRadius: 15,

      marginHorizontal: padding,
      maxWidth: 500,

      flex: 1,
    },
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const listflat = useRef(undefined);

  const searchHeight = 40 + padding;

  return (
    <Container>
      <View style={styles.container}>
        {/* <Authors /> */}
        {/* {lecture ? ( */}

        <Animated.View
          style={{
            paddingTop: Constants.statusBarHeight,
            position: "absolute",
            opacity: scrollY.interpolate({
              inputRange: [-1, 0, searchHeight, searchHeight + 1],
              outputRange: [1, 1, 0, 0],
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-1, 0, searchHeight, searchHeight + 1],
                  outputRange: [0, 0, -searchHeight, -searchHeight],
                }),
              },
            ],
          }}
        >
          <HeaderText text="Search" customPaddingTop={1} />
        </Animated.View>

        <Animated.View
          style={{
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-1, 0, searchHeight, searchHeight + 1],
                  outputRange: [searchHeight, searchHeight, 0, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.SearchBar}>
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => onChangeText(text)}
              value={inputValue}
              /* autoFocus={true} */
              onSubmitEditing={handleSubmit}
              clearButtonMode={"while-editing"}
              placeholder={"What are you searching for?"}
              placeholderTextColor={colors.secondary}
              keyboardAppearance={dark ? "dark" : "light"}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.searchicon}>
                <Feather
                  name={"search"}
                  size={30}
                  style={{ paddingHorizontal: 9 }}
                  color={"white"}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View
          style={{
            flex: 1,
            //paddingLeft: padding,
            paddingTop: padding,
            zIndex: -1000,
          }}
        >
          <Animated.FlatList
            ref={listflat}
            data={lecture}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreLecs}
            ListHeaderComponent={<ListHeader />}
            //getNativeScrollRef={(ref) => (flatlistRef = ref)}
            keyboardDismissMode={"on-drag"}
            numColumns={Math.floor(width / 600)}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
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
    </Container>
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
