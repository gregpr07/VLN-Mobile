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

import { Ionicons, AntDesign } from "@expo/vector-icons";
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
import { getUserToken } from "./services/storage/actions";

import { colors, LightTheme, DarkTheme } from "./services/themes";

import { useColorScheme } from "react-native-appearance";
import { BASEURL } from "./services/fetcher";
import { color } from "react-native-reanimated";

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

const App = ({ token, getUserToken, videoID, videoRef }: any) => {
  const insets = useSafeAreaInsets();
  // fonts
  /*   let [fontsLoaded] = useFonts({
    SF_UI_BLACK: require("./assets/fonts/HKGrotesk-black.otf"),
  }); */

  useEffect(() => {
    getUserToken();
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
      //"SF-UI-thin": require("./assets/fonts/HKGrotesk-Thin.otf"),
      //"SF-UI-ultralight": require("./assets/fonts/HKGrotesk-ultralight.otf"),
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
      paddingLeft: 12,
    },
    headerBackImage: ({ tintColor }) => (
      <Ionicons
        name={"md-arrow-back"}
        size={24}
        style={{ marginLeft: 20 }}
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
              headerTitle: "videolectures.net",
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
                  <Ionicons
                    name={"md-settings"}
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
                  <Ionicons
                    name={"md-sunny"}
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
          options={{ headerShown: false }}
          component={LoginScreen}
        />
      )}
    </ProfileStack.Navigator>
  );

  const linking = {
    prefixes: [BASEURL, "localhost:5000/"],
  };

  return (
    <NavigationContainer
      linking={linking}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
