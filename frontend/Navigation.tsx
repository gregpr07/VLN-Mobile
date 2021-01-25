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

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Feather } from "@expo/vector-icons";
import VideoScreen from "./pages/video";
import SearchScreen from "./pages/search";
import HomeScreen from "./pages/homescreen";
import ProfileScreen from "./pages/profile";
import VideosScreen from "./pages/videoscreen";
import Event from "./pages/event";
import LoginScreen from "./pages/login";
import SettingScreen from "./pages/settings";
import Category from "./pages/category";
import Author from "./pages/author";

import DevOnlyComponent from "./pages/devcomponents";

import { AppLoading } from "expo";

import * as Font from "expo-font";

import { connect } from "react-redux";
import { getUserToken, setVideoID } from "./services/storage/actions";

import { colors, LightTheme, DarkTheme } from "./services/themes";

import { useColorScheme } from "react-native-appearance";
import { BASEURL } from "./services/fetcher";
import * as Linking from "expo-linking";

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const VideoStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const PlayerStack = createStackNavigator();

const VideoStackScreen = () => {
  return (
    <VideoStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <VideoStack.Screen name="Videos" component={VideosScreen} />
    </VideoStack.Navigator>
  );
};

const PlayerStackScreen = () => {
  return (
    <PlayerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PlayerStack.Screen
        name="Video"
        component={VideoScreen}
        initialParams={{
          lectureID: false,
        }}
      />
    </PlayerStack.Navigator>
  );
};

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
  //!

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

  // default is the system default
  const [themeIsDark, setThemeIsDark] = useState(scheme === "dark");

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  const HeaderOptions = {
    headerStyle: {
      backgroundColor: themeIsDark ? "black" : colors.whiteBackground,
      shadowColor: "transparent",
      elevation: 0,
      borderBottomWidth: 0,
      transform: [
        {
          translateY: Platform.OS === "web" ? 70 : 0,
        },
      ],
    },
    //headerTintColor: themeIsDark ? colors.dark : colors.darkGreyBlue,
    headerTitleStyle: {
      fontFamily: "SF-UI-semibold",
      lineHeight: 22,
      letterSpacing: 1,
      textAlign: "center",
      color: themeIsDark ? colors.paleGrey : colors.darkGreyBlue,
      fontSize: 20,
      shadowOpacity: 0,
      /* paddingLeft: 12, */
    },
    headerBackImage: ({ tintColor }) => (
      <Feather
        name={"arrow-left"}
        size={24}
        style={{ marginLeft: 12 }}
        color={themeIsDark ? colors.paleGrey : colors.darkGreyBlue}
      />
    ),

    headerBackTitleVisible: false,
  };

  const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={{ ...HeaderOptions }}>
      <HomeStack.Screen
        name="home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="event"
        component={Event}
        options={({ route }) => ({ title: route.params.eventTitle })}
      />
      <HomeStack.Screen
        name="category"
        component={Category}
        options={({ route }) => ({ title: route.params.category })}
      />
      <HomeStack.Screen name="author" component={Author} />
    </HomeStack.Navigator>
  );

  const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={{ ...HeaderOptions }}>
      {token.token ? (
        <>
          <ProfileStack.Screen
            name="profile"
            options={({ navigation }) => ({
              headerTitle: Platform.OS === "web" ? null : "videolectures.net",
              headerTitleStyle: {
                fontFamily: "SF-UI-semibold",
                fontSize: 24,
              },
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    height: 24,
                    width: 24,
                    marginRight: 20,
                  }}
                  onPress={() => navigation.push("settings")}
                >
                  <Feather
                    name={"settings"}
                    size={24}
                    color={themeIsDark ? colors.paleGrey : colors.darkGreyBlue}
                  />
                </TouchableOpacity>
              ),
            })}
            component={ProfileScreen}
          />
          <ProfileStack.Screen
            name="settings"
            options={({ navigation }) => ({
              title: "Settings",
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    height: 24,
                    width: 24,
                    marginRight: 20,
                  }}
                  onPress={() => setThemeIsDark(!themeIsDark)}
                >
                  <Feather
                    name={themeIsDark ? "sun" : "moon"}
                    size={24}
                    color={themeIsDark ? colors.paleGrey : colors.darkGreyBlue}
                  />
                </TouchableOpacity>
              ),
            })}
            component={SettingScreen}
          />
        </>
      ) : (
        <ProfileStack.Screen
          name="login"
          options={({ navigation }) => ({
            headerTitle: Platform.OS === "web" ? null : "videolectures.net",
            headerTitleStyle: {
              fontFamily: "SF-UI-semibold",
              fontSize: 24,
            },
            headerRight: () => (
              <TouchableOpacity
                style={{
                  height: 24,
                  width: 24,
                  marginRight: 20,
                }}
                onPress={() => setThemeIsDark(!themeIsDark)}
              >
                <Feather
                  name={themeIsDark ? "sun" : "moon"}
                  size={24}
                  color={themeIsDark ? colors.paleGrey : colors.darkGreyBlue}
                />
              </TouchableOpacity>
            ),
          })}
          component={LoginScreen}
        />
      )}
    </ProfileStack.Navigator>
  );

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Text>Loading...</Text>}
      theme={themeIsDark ? DarkTheme : LightTheme}
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
          backgroundColor: themeIsDark ? colors.dark : "white",

          marginLeft: Platform.OS === "web" ? "10vw" : null,
        }}
      />
      <StatusBar style={themeIsDark ? "light" : "dark"} />
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
