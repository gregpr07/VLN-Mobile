import { View, useWindowDimensions, Platform } from "react-native";
import React from "react";

export default (props) => {
  const windowHeight = useWindowDimensions().height;

  return (
    <View
      style={{
        marginTop: 70,
        flex: 1,
        height: windowHeight,
      }}
    >
      {props.children}
    </View>
  );
};
