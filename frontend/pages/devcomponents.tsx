import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import ViewPager from "@react-native-community/viewpager";

import * as Updates from "expo-updates";

const MyPager = ({ navigation }) => {
  /*   React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log(navigation.dangerouslyGetState());
    });

    return unsubscribe;
  }, [navigation]); */

  return (
    <View style={{ flex: 1 }}>
      <ViewPager style={styles.viewPager} initialPage={0}>
        <View style={styles.page} key="1">
          <Text>First page</Text>
          <Text>Swipe ➡️</Text>
        </View>
        <View style={styles.page} key="2">
          <Text>Second page</Text>
        </View>
        <View style={styles.page} key="3">
          <Text>Third page</Text>
        </View>
      </ViewPager>
      <Button onPress={() => Updates.reloadAsync()} title="reload app" />
    </View>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 0.5,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyPager;
