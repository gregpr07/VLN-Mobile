import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";
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
import { getUserToken } from "./services/actions";

import { colors, LightTheme, DarkTheme } from "./services/themes";

import { useColorScheme } from "react-native-appearance";

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
              title: "",
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
    prefixes: ["https://localhost:8000/", "localhost:8000/"],
  };
  return (
    <NavigationContainer
      linking={linking}
      theme={themeIsDark ? DarkTheme : LightTheme}
    >
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = "";

            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home";
            } else if (route.name === "Profile") {
              iconName = focused ? "ios-person" : "ios-person";
            } else if (route.name == "Search") {
              iconName = "ios-search";
            } else if (route.name == "DEV") {
              iconName = "ios-bug";
            } else if (route.name == "Player") {
              iconName = "ios-play-circle";
            } else if (route.name === "Video") {
              iconName = focused ? "ios-videocam" : "ios-videocam";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: themeIsDark ? colors.orangish : colors.orangish,
          inactiveTintColor: themeIsDark ? "white" : "gray",
          showLabel: false,
          style: {
            borderTopWidth: 0,

            shadowOffset: {
              width: 5,
              height: 10,
            },
            shadowColor: "black",
            shadowOpacity: 0.5,
          },
        }}
      >
        <Tabs.Screen name="Home" component={HomeStackScreen} />
        {/*  <Tabs.Screen name="Video" component={VideoStackScreen} /> */}
        {/*    {videoID || !videoRef ? ( */}
        <Tabs.Screen name="Player" component={PlayerStackScreen} />
        {/*      ) : null} */}

        <Tabs.Screen name="Search" component={SearchScreen} />
        <Tabs.Screen name="Profile" component={ProfileStackScreen} />
        <Tabs.Screen name="DEV" component={DevOnlyComponent} />
      </Tabs.Navigator>
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
