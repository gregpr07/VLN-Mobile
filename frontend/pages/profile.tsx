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
  Button,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@react-navigation/native";

const padding = 24;
export default function ProfileScreen({ navigation }) {
  const { colors, dark } = useTheme();
  interface profileStats {
    profileImage: string;
    name: string;
    title: string;
  }
  const profileStats: profileStats = {
    profileImage:
      "https://blogs.bmj.com/ebn/files/2015/11/Professor-Brendan-McCormack-low-res-2-683x1024.jpg",
    name: "Stanko Novaković",
    title: "M.I.T Professor",
  };

  const Header = () => {
    const ProfileImage = () => (
      <View
        style={{
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowRadius: 19,
          shadowOpacity: 1,
        }}
      >
        <Image
          source={{ uri: profileStats.profileImage }}
          style={{
            height: 150,
            width: 150,
            borderRadius: 150,
          }}
        />
      </View>
    );
    return (
      <View
        style={{
          alignItems: "center",
        }}
      >
        <ProfileImage />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: padding,
    },
    h1: {
      fontSize: 36,
      textAlign: "center",
      fontFamily: "SF-UI-semibold",
      color: colors.text,
    },
    h2: {
      fontSize: 30,
      fontFamily: "SF-UI-semibold",
      textAlign: "center",
      lineHeight: 40,
      color: colors.text,
    },

    h3: {
      fontSize: 28,
      fontFamily: "SF-UI-medium",
      height: 28,
      color: colors.text,
    },
    h4: {
      fontSize: 18,
      fontFamily: "SF-UI-medium",
      textAlign: "center",
      color: colors.text,
    },
    h5: {
      fontSize: 16,
      fontFamily: "SF-UI-medium",
      color: colors.secondary,
    },

    gray: {
      color: "#828282",
    },
    video_title: {
      fontSize: 22,
      paddingBottom: 16,
      paddingTop: 16,
      fontFamily: "SF-UI-medium",
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
      fontFamily: "SF-UI-light",
      fontSize: 16,
      color: "#4F4F4F",
    },
    button_default: {
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 20,
      backgroundColor: "#5DB075",
      fontSize: 20,
      fontFamily: "SF-UI-medium",
    },
  });

  return (
    <View>
      <Header />
      <View style={{ paddingTop: 15 }}>
        <Text style={styles.h2}>{profileStats.name}</Text>
        <Text style={[styles.h4]}>{profileStats.title}</Text>
      </View>
    </View>
  );
}
