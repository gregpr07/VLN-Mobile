import * as React from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import Ionicons from "react-native-vector-icons/Ionicons";
import VideoScreen from "./pages/video";
import SearchScreen from "./pages/search";
import ModalScreen from "./pages/video_new_note";
import HomeScreen from "./pages/homescreen";

import { AppLoading } from "expo";

import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_300Light,
} from "@expo-google-fonts/inter";

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
    </View>
  );
}

function VideosScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Video!</Text>
      <Button
        onPress={() =>
          navigation.push("Video", {
            videoID: 10,
            title:
              "How Machine Learning has Finally Solved Wanamaker’s Dilemma",
          })
        }
        title="Go to video"
      />
    </View>
  );
}

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const VideoStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const VideoModal = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <HomeStack.Screen name="home" component={HomeScreen} />
  </HomeStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const VideoStackScreen = () => {
  return (
    <VideoStack.Navigator>
      <VideoStack.Screen
        name="Videos"
        component={VideosScreen}
        options={({ navigation, route }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.push("Search")}
              style={{ paddingRight: 15 }}
            >
              <Ionicons name="ios-search" size={20} />
            </TouchableOpacity>
          ),
        })}
      />
      <VideoStack.Screen
        name="Video"
        component={VideoScreen}
        options={({ navigation, route }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.push("Search")}
              style={{ paddingRight: 15 }}
            >
              <Ionicons name="ios-search" size={20} />
            </TouchableOpacity>
          ),
          title: route.params.title,
        })}
      />
      <VideoStack.Screen name="Search" component={SearchScreen} />
    </VideoStack.Navigator>
  );
};

const VideoStackRoot = () => {
  return (
    <VideoModal.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={{
        cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <VideoModal.Screen name="Main" component={VideoStackScreen} />
      <VideoModal.Screen name="NewNote" component={ModalScreen} />
    </VideoModal.Navigator>
  );
};

export default () => {
  // fonts
  let [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_300Light,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home";
            } else if (route.name === "Video") {
              iconName = focused ? "ios-videocam" : "ios-videocam";
            } else if (route.name === "Profile") {
              iconName = focused ? "ios-person" : "ios-person";
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
        <Tabs.Screen name="Video" component={VideoStackRoot} />
        <Tabs.Screen name="Profile" component={ProfileStackScreen} />
      </Tabs.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};
