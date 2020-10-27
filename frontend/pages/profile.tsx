import React, {useEffect, useState} from "react";
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";

import {useFocusEffect, useTheme} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {API} from "../services/fetcher";
import {numberWithCommas, shorterText} from "../services/functions";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");

const padding = 24;
export default function ProfileScreen({ navigation }) {

  const { colors, dark } = useTheme();

  const [activeTab, setActiveTab] = useState("starred");
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
              })
              .catch(error => console.log('error', error));

          fetch(API + "/noted/", requestOptions)
              .then(response => response.json())
              .then(json => {
                  const notes = json["lectures"];
                  setNotes(notes);
              })
              .catch(error => console.log('error', error));
      }, [])
  );

  const [userData, setUserData] = useState({
      profileImage: "https://i.kym-cdn.com/photos/images/original/001/561/356/734.jpg",
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
                <View style={[styles.navItem, styles.navLeft]} onTouchStart={() => setActiveTab("starred")}>
                    <Text style={[styles.navText, activeTab == "starred" ? styles.active : {}]}>
                      Starred
                    </Text>
                </View>
                <View style={[styles.navItem]} onTouchStart={() => setActiveTab("notes")}>
                    <Text style={[styles.navText, activeTab == "notes" ? styles.active : {}]}>
                        Notes
                    </Text>
                </View>
                <View style={[styles.navItem, styles.navRight]} onTouchStart={() => setActiveTab("history")}>
                    <Text style={[styles.navText, activeTab == "history" ? styles.active : {}]}>
                        History
                    </Text>
                </View>
            </View>
        )
    }

    const styles = StyleSheet.create({
      userName: {
        fontSize: 30,
        textAlign: "center",
        fontFamily: "SF-UI-semibold",
        color: colors.text,
      },
      userTag: {
        fontSize: 18,
        fontFamily: "SF-UI-semibold",
        textAlign: "center",
        lineHeight: 40,
        color: colors.text,
        marginTop: -5,
      },
      navsContainer: {
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
      active: {
        fontWeight: "bold",
      },
      card: {
        marginHorizontal: 20,
        backgroundColor: colors.card,
        borderRadius: 10,
      },
      cardBody: {
          padding: 10,
      },
      container: {
        flex: 1,

        paddingTop: Constants.statusBarHeight,
      },
      h1: {
        fontSize: 36,
        textAlign: "center",
        fontFamily: "SF-UI-semibold",
      },

      h3: {
        fontSize: 14,
        fontFamily: "SF-UI-semibold",
        textAlign: "center",
      },
      h4: {
        paddingBottom: 2,
        fontSize: 14,
        fontFamily: "SF-UI-medium",
        color: colors.text,
      },
      h5: {
        fontSize: 12,
        fontFamily: "SF-UI-medium",
      },

      gray: {
        color: "#828282",
      },
      recommendation: {
        flexDirection: "row",
      },
      default_card: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowRadius: 19,
        shadowOpacity: 1,

        backgroundColor: colors.card,
        //padding: padding,
        borderRadius: 15,
        marginBottom: 10,

        marginRight: padding,
        maxWidth: 500,

        flex: 1,
      },
    });

  const Separator = () => (
    <Text
      style={{
        color: "#5468fe",
      }}
    >
      {" "}
      |{" "}
    </Text>
  );

  const renderItem = (item: any) => (
    <View style={styles.default_card} key={item.id}>
      <TouchableOpacity
        // onPress={() => _handleResultsClick(item)}
        //key={item.title}
        style={styles.recommendation}
      >
        <Image
          source={
            item.thumbnail
              ? {
                uri: item.thumbnail,
              }
              : dark
              ? require("../assets/icons/videolecture-net-dark.png")
              : require("../assets/icons/videolecture-net-light.png")
          }
          style={{
            height: 80,
            maxWidth: (80 / 9) * 16,
            flex: 3,

            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            resizeMode: item.thumbnail ? "cover" : "contain",
          }}
        />
        <View style={{ flex: 4, padding: 6, alignContent: "center" }}>
          <Text style={[styles.h4]}>{shorterText(item.title, 75)}</Text>
          <View>
            <Text style={[styles.h5, { color: colors.secondary }]}>
              {item.author.name}
              <Separator />
              {numberWithCommas(item.views)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header />
      <View style={{ paddingTop: 15 }}>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={[styles.userTag]}>{userData.title}</Text>
      </View>
      <Menu />
      <View>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View>
              {activeTab == "starred" &&
                <View>
                  {starredLectures.map((lecture) => {
                    return renderItem(lecture);
                  })}
                </View>
              }
              {activeTab == "notes" &&
                <View>
                  {notes.map((lecture) => {
                    return renderItem(lecture);
                  })}
                </View>
              }
              {activeTab == "history" &&
                <Text>
                  History
                  {/* TODO: implement me in backend first */}
                </Text>
              }
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
