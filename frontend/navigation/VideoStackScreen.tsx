import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import VideosScreen from "../pages/videoscreen";

const VideoStack = createStackNavigator();

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

export default VideoStackScreen;
