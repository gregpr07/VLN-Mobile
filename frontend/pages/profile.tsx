import React, {useEffect, useState} from "react";
import {Dimensions, Image, StyleSheet, Text, View,} from "react-native";

import {useTheme} from "@react-navigation/native";
import {useSelector} from "react-redux";

const { width, height } = Dimensions.get("window");

const padding = 24;
export default function ProfileScreen({ navigation }) {

  const { colors, dark } = useTheme();

  const tokenState = useSelector(state => state.token);
  const [userData, setUserData] = useState({
      profileImage: "https://blogs.bmj.com/ebn/files/2015/11/Professor-Brendan-McCormack-low-res-2-683x1024.jpg",
      name: "",
      title: "",
    }
  );

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${tokenState.token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://vln-mobile.ijs.si/api/auth/user/", requestOptions)
        .then(response => response.json())
        .then(json => {
          console.log("Fetching user data.");
          console.log(json);
          setUserData({
            ...userData,
            name: json.first_name + " " + json.last_name,
            title: "@" + json.username,
          })

        })
        .catch(error => console.log('error', error));
  }, []);

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
          source={{ uri: userData.profileImage }}
          style={{
            height: 150,
            width: 150,
            borderRadius: 150,
            borderColor: colors.border,
            borderWidth: 9,
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

  const Menu = () => {
    return (
        <View style={styles.navsContainer}>
            <View style={styles.navsLeft}>
                <Text style={styles.navsText}>Uno</Text>
            </View>
            <View style={styles.navsLeft}>
                <Text style={styles.navsText}>Due</Text>
            </View>
            <View style={styles.navsLeft}>
                <Text style={styles.navsText}>Tres</Text>
            </View>
        </View>
    )
  }

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
    navsContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        paddingTop: 20,
    },
    navsLeft: {
        width: 104,
        height: 44,
        borderRadius: 15,
        backgroundColor: "#ffffff"
    },
    navsMid: {
        width: 105,
        height: 44,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(60, 128, 209, 0.09)",
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowRadius: 19,
        shadowOpacity: 1
    },
    navsRight: {
        width: 104,
        height: 44,
        borderRadius: 15,
        backgroundColor: "#ffffff"
    },
    navsText: {
        width: 60,
        height: 17,
        fontFamily: "HKGrotesk",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 1,
        textAlign: "center",
        color: "red",
        textTransform: "uppercase",
    }
  });

  return (
    <View>
      <Header />
      <View style={{ paddingTop: 15 }}>
        <Text style={styles.h2}>{userData.name}</Text>
        <Text style={[styles.h4]}>{userData.title}</Text>
      </View>
      <Menu />
    </View>
  );
}
