import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { TabBar } from "./components/CustomTabbar";

import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import SearchScreen from "./pages/search";

import * as Font from "expo-font";

import { connect } from "react-redux";
import { getUserToken, setVideoID } from "./services/storage/actions";

import { colors, LightTheme, DarkTheme } from "./services/themes";

import { useColorScheme } from "react-native-appearance";
import { BASEURL } from "./services/fetcher";
import * as Linking from "expo-linking";

import VideoStackScreen from "./navigation/VideoStackScreen";
import PlayerStackScreen from "./navigation/PlayerStackScreen";
import HomeStackScreen from "./navigation/HomeStackScreen";
import ProfileStackScreen from "./navigation/ProfileStackScreen";

const Tabs = createBottomTabNavigator();

//! linking

const config = {
  screens: {
    Home: {
      screens: {
        home: "",
      },
    },
    Video: {
      screens: {
        Videos: "explore",
      },
    },
    Player: "video",
    Search: "search",
    Profile: {
      screens: {
        profile: "profile",
        settings: "settings",
        login: "login",
      },
    },
  },
};
const prefix = Linking.makeUrl("/");

const linking = {
  prefixes: [prefix],
  config,
};
//!

const App = ({ token, getUserToken, videoID, videoRef, setVidID }: any) => {
  //! linking with redux
  const _handleUrl = ({ url }) => {
    console.log(url);
    let { path, queryParams } = Linking.parse(url);
    if (videoID !== queryParams.id) {
      setVidID(queryParams.id);
    }
  };

  Linking.addEventListener("url", _handleUrl);

  async function getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url != null) {
      _handleUrl({ url });
    }
  }

  const insets = useSafeAreaInsets();
  useEffect(() => {
    getUserToken();
    getInitialURL();
  }, []);
  //!

  // fonts tutorial -  https://medium.com/@hemanshuM/add-custom-font-in-your-react-native-expo-app-88005a341f5c
  const loadFonts = () => {
    return Font.loadAsync({
      //"SF-UI-black": require("./assets/fonts/HKGrotesk-black.otf"),
      "SF-UI-bold": require("./assets/fonts/HKGrotesk-Bold.otf"),
      //"SF-UI-heavy": require("./assets/fonts/HKGrotesk-heavy.otf"),
      "SF-UI-light": require("./assets/fonts/HKGrotesk-Light.otf"),
      "SF-UI-regular": require("./assets/fonts/HKGrotesk-Regular.otf"),
      "SF-UI-medium": require("./assets/fonts/HKGrotesk-Medium.otf"),
      "SF-UI-semibold": require("./assets/fonts/HKGrotesk-SemiBold.otf"),
    });
  };

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const scheme = useColorScheme();
  console.log(scheme);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Text>Loading...</Text>}
      theme={scheme === "dark" ? DarkTheme : LightTheme}
    >
      <Tabs.Navigator
        tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
      >
        <Tabs.Screen name="Home" component={HomeStackScreen} />
        <Tabs.Screen name="Video" component={VideoStackScreen} />
        {/*    {videoID || !videoRef ? ( */}
        <Tabs.Screen name="Player" component={PlayerStackScreen} />
        {/*      ) : null} */}

        <Tabs.Screen name="Search" component={SearchScreen} />
        <Tabs.Screen name="Profile" component={ProfileStackScreen} />
        {/*  <Tabs.Screen name="DEV" component={DevOnlyComponent} /> */}
      </Tabs.Navigator>
      <View
        style={{
          paddingBottom: (insets.bottom / 4) * 3,
          backgroundColor: scheme === "dark" ? colors.dark : "white",

          marginLeft: Platform.OS === "web" ? "10vw" : null,
        }}
      />
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => ({
  token: state.token,
  videoID: state.video.videoID,
  videoRef: state.video.videoRef,
});

const mapDispatchToProps = (dispatch) => ({
  getUserToken: () => dispatch(getUserToken()),
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
