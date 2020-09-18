import React, { useState } from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";
import VideoScreen from "./pages/video";
import SearchScreen from "./pages/search";
//import ModalScreen from "./pages/video_new_note_deprecated";
import HomeScreen from "./pages/homescreen";
import ProfileScreen from "./pages/profile";
import VideosScreen from "./pages/videoscreen";
import Event from "./pages/event";

import DevOnlyComp from "./pages/devcomponents";

import { AppLoading } from "expo";

import * as Font from "expo-font";

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const VideoStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const PlayerStack = createStackNavigator();

//const VideoModal = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="home"
      options={{ headerShown: false }}
      component={HomeScreen}
    />
    <HomeStack.Screen name="event" component={Event} />
  </HomeStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <ProfileStack.Screen name="profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const VideoStackScreen = () => {
  return (
    <VideoStack.Navigator>
      <VideoStack.Screen name="Videos" component={VideosScreen} />
      {/*       <VideoStack.Screen
        name="Video"
        component={VideoScreen}

      /> */}
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
          videoID: 1,
          title: 1,
          video_url: {
            uri:
              "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4",
          },
        }}
      />
    </PlayerStack.Navigator>
  );
};

export default () => {
  // fonts
  /*   let [fontsLoaded] = useFonts({
    SF_UI_BLACK: require("./assets/fonts/sf-ui-display-black.otf"),
  }); */

  // fonts tutorial -  https://medium.com/@hemanshuM/add-custom-font-in-your-react-native-expo-app-88005a341f5c
  const loadFonts = () => {
    return Font.loadAsync({
      "SF-UI-black": require("./assets/fonts/sf-ui-display-black.otf"),
      "SF-UI-bold": require("./assets/fonts/sf-ui-display-bold.otf"),
      "SF-UI-heavy": require("./assets/fonts/sf-ui-display-heavy.otf"),
      "SF-UI-light": require("./assets/fonts/sf-ui-display-light.otf"),
      "SF-UI-medium": require("./assets/fonts/sf-ui-display-medium.otf"),
      "SF-UI-semibold": require("./assets/fonts/sf-ui-display-semibold.otf"),
      "SF-UI-thin": require("./assets/fonts/sf-ui-display-thin.otf"),
      "SF-UI-ultralight": require("./assets/fonts/sf-ui-display-ultralight.otf"),
    });
  };

  const [fontsLoaded, setFontsLoaded] = useState(false);

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
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = "";

            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home";
            } else if (route.name === "Video") {
              iconName = focused ? "ios-videocam" : "ios-videocam";
            } else if (route.name === "Profile") {
              iconName = focused ? "ios-person" : "ios-person";
            } else if (route.name == "Search") {
              iconName = "ios-search";
            } else if (route.name == "DEV") {
              iconName = "ios-bug";
            } else if (route.name == "Player") {
              iconName = "ios-play-circle";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#EB5757",
          inactiveTintColor: "gray",
          showLabel: false,
          style: {
            borderTopWidth: 0,
            backgroundColor: "white",
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
        <Tabs.Screen name="Video" component={VideoStackScreen} />
        <Tabs.Screen name="Player" component={PlayerStackScreen} />
        <Tabs.Screen name="Search" component={SearchScreen} />
        <Tabs.Screen name="Profile" component={ProfileStackScreen} />
        <Tabs.Screen name="DEV" component={DevOnlyComp} />
      </Tabs.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
};
