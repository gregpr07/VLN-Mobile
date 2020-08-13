import React, { useState } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

const padding = 24;
export default function ProfileScreen() {
  const profileStats = {
    profileImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Official_portrait_of_Barack_Obama.jpg/1200px-Official_portrait_of_Barack_Obama.jpg",
    name: "Stanko Novaković",
    title: "M.I.T Professor of Slovenian language",
  };

  const Header = () => {
    const ProfileImage = () => (
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        }}
      >
        <Image
          source={{ uri: profileStats.profileImage }}
          style={{
            height: width / 2.4,
            width: width / 2.4,
            maxHeight: 300,
            maxWidth: 300,
            borderRadius: 300,
            borderColor: "white",
            borderWidth: 5,
            transform: [
              {
                translateY: 30,
              },
            ],
          }}
        />
      </View>
    );
    return (
      <View
        style={{
          paddingTop: Constants.statusBarHeight,
          backgroundColor: "#5DB075",
          paddingBottom: 0,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Text style={styles.h1}>Profile</Text>
        <ProfileImage />
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <Header />
      <View style={{ paddingTop: 16, paddingBottom: 24 }}>
        <Text style={styles.h2}>{profileStats.name}</Text>
        <Text style={[styles.h4, { marginTop: 8 }]}>{profileStats.title}</Text>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
    backgroundColor: "white",
  },
  h1: {
    fontSize: 36,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },
  h2: {
    fontSize: 28,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },

  h3: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  h4: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  h5: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },

  gray: {
    color: "#828282",
  },
  video_title: {
    fontSize: 22,
    paddingBottom: 16,
    paddingTop: 16,
    fontFamily: "Inter_500Medium",
    paddingRight: 32,
  },
  video: {
    borderRadius: 16,
    height: ((width - 2 * padding) / 16) * 9,
    width: width - 2 * padding,
  },
  description: {
    paddingVertical: 8,
  },
  recommendation: {
    paddingVertical: 8,
    flexDirection: "row",
  },
  your_notes: {
    borderRadius: 16,
    paddingHorizontal: 16,
    //height: 100,
    marginVertical: 8,
    backgroundColor: "white",
  },
  note_text: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
    color: "#4F4F4F",
  },
  button_default: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "#5DB075",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
});