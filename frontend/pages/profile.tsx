import React, {useEffect, useState} from "react";
import {Dimensions, Image, StyleSheet, Text, View,} from "react-native";

import {useTheme, useFocusEffect} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {API, fetcher, noHeadFetcher} from "../services/fetcher";

const { width, height } = Dimensions.get("window");

const padding = 24;
export default function ProfileScreen({ navigation }) {

  const { colors, dark } = useTheme();

  const tokenState = useSelector(state => state.token);
  const [starredLectures, setStarredLectures] = useState([]);
  const [notes, setNotes] = useState([]);

  useFocusEffect(
      React.useCallback(() => {
          const myHeaders = new Headers();
          myHeaders.append("Authorization", `Token ${tokenState.token}`);

          const requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
          };

          fetch(API + "starred/", requestOptions)
              .then(response => response.json())
              .then(json => {
                  const lectures = json["lectures"];
                  setStarredLectures(lectures);
                  console.log(lectures);
              })
              .catch(error => console.log('error', error));

          fetch(API + "/note/", requestOptions)
              .then(response => response.json())
              .then(json => {
                  const notes = json["results"];
                  setNotes(notes);
                  console.log(notes);
              })
              .catch(error => console.log('error', error));
      }, [])
  );

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
            <View style={[styles.navItem, styles.navLeft]}>
                <Text style={styles.navText}>
                    Starred
                </Text>
            </View>
            <View style={[styles.navItem]}>
                <Text style={styles.navText}>
                    Notes
                </Text>
            </View>
            <View style={[styles.navItem, styles.navRight]}>
                <Text style={styles.navText}>
                    History
                </Text>
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
        backgroundColor: "red",
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        margin: 20,
    },
    navItem: {
      padding: 10,
      paddingBottom: 13,
      width: "33.33%",
      backgroundColor: colors.card,
    },
    navLeft: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderRightWidth: 1,
        borderColor: colors.shadow,
    },
    navRight: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderLeftWidth: 1,
        borderColor: colors.shadow,
    },
    navText: {
        fontFamily: "SF-UI-medium",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 1,
        textAlign: "center",
        color: colors.text,
        textTransform: "uppercase",
    },
    card: {
        backgroundColor: colors.card,
        margin: 20,
        marginTop: 42,
        height: 300,
        borderRadius: 10,
    },
    cardBody: {
        padding: 10,
    },
  });

  return (
    <View>
      <Header />
      <View style={{ paddingTop: 15 }}>
        <Text style={styles.h2}>{userData.name}</Text>
        <Text style={[styles.h4]}>{userData.title}</Text>
      </View>
      <Menu />
      <View style={styles.card}>
          <View style={styles.cardBody}>

          </View>
      </View>
    </View>
  );
}
