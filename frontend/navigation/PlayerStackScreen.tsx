import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import VideoScreen from "../pages/video";

const PlayerStack = createStackNavigator();

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

export default PlayerStackScreen;
