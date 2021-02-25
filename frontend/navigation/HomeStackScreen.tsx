import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { useTheme } from "@react-navigation/native";

import HomeScreen from "../pages/homescreen";
import Category from "../pages/category";
import Author from "../pages/author";
import Event from "../pages/event";

const HomeStack = createStackNavigator();

import headerOptions from "./headerOptions";

const HomeStackScreen = () => {
  const { colors, dark } = useTheme();

  return (
    <HomeStack.Navigator screenOptions={{ ...headerOptions(colors) }}>
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
};

export default HomeStackScreen;
