import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import defaultStyles from "../constants/DefaultStyleSheet";

import { useFocusEffect, useTheme } from "@react-navigation/native";
import { connect, useSelector } from "react-redux";
import { API } from "../services/fetcher";
import { numberWithCommas, shorterText } from "../services/functions";
import Constants from "expo-constants";
import { setVideoID } from "../services/storage/actions";
import Container from "../components/Container";

const { width, height } = Dimensions.get("window");

const padding = 14;
function ProfileScreen({ navigation, setVidID }: any) {
  const { colors, dark } = useTheme();

  const [activeTab, setActiveTab] = useState("starred");
  const tokenState = useSelector((state) => state.token);
  const [starredLectures, setStarredLectures] = useState([]);
  const [lectureHistory, setLectureHistory] = useState([]);
  const [notes, setNotes] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${tokenState.token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(API + "starred/", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          const lectures = json["lectures"];
          setStarredLectures(lectures);
          console.log(lectures);
        })
        .catch((error) => console.log("error", error));

      fetch(API + "noted/", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          console.log("noted");
          const notes = json["lectures"];
          setNotes(notes);
          console.log(notes);
        })
        .catch((error) => console.log("error", error));

      fetch(API + "history/", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          let lectures = [];
          for (let i = 0; i < json["history"].length; i++) {
            lectures.push(json["history"][i]["lecture"]);
          }
          setLectureHistory(lectures);
          console.log(history);
        })
        .catch((error) => console.log("error", error));
    }, [])
  );

  const [userData, setUserData] = useState({
    name: "",
    title: "",
  });

  useEffect(() => {
    //! POGLEJ V ACTIONS -> GETUSERTOKEN - lahko nardis globally tole ce hocs

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${tokenState.token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API + "auth/user/", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        console.log("Fetching user data.");
        console.log(json);
        setUserData({
          ...userData,
          name: json.first_name + " " + json.last_name,
          title: "@" + json.username,
        });
      })
      .catch((error) => console.log("error", error));
  }, []);

  const Header = () => {
    const ProfileImage = () => (
      <View style={{}}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            height: 150,
            width: 150,
            resizeMode: "contain",
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
        <TouchableOpacity
          style={[styles.navItem, styles.navLeft]}
          onPress={() => setActiveTab("starred")}
        >
          <Text
            style={[
              styles.navText,
              activeTab == "starred" ? styles.active : {},
            ]}
          >
            Starred
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem]}
          onPress={() => setActiveTab("notes")}
        >
          <Text
            style={[styles.navText, activeTab == "notes" ? styles.active : {}]}
          >
            Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.navRight]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.navText,
              activeTab == "history" ? styles.active : {},
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
      color: colors.secondary,
      marginBottom: padding / 2,
    },
    navsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-start",
      margin: padding,
      marginTop: 2 * padding,
      ...defaultStyles.shadow,
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
      fontFamily: "SF-UI-semibold",
      fontSize: 16,
      fontWeight: "normal",
      fontStyle: "normal",
      letterSpacing: 1,
      textAlign: "center",
      color: colors.secondary,

      textTransform: "uppercase",
    },
    active: {
      color: colors.text,
      fontSize: 16,
    },
    cardBody: {
      paddingLeft: padding,
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
      ...defaultStyles.shadow,

      backgroundColor: colors.card,
      //padding: padding,
      borderRadius: 15,
      marginBottom: 10,

      marginRight: padding,
      maxWidth: 500,

      flex: 1,
    },
    padded: {
      padding: 15,
    },
  });

  const Separator = () => (
    <Text
      style={{
        color: colors.secondary,
      }}
    >
      {" "}
      |{" "}
    </Text>
  );

  const _handleResultsClick = async (item: any) => {
    setVidID(item.id);
    navigation.navigate("Player", {
      screen: "Video",
    });
  };

  const renderItem = (item: any, isNote: boolean) => (
    <View style={styles.default_card} key={item.id}>
      <TouchableOpacity
        onPress={() => _handleResultsClick(item)}
        //key={item.title}
        style={styles.recommendation}
      >
        <Image
          source={
            item.thumbnail
              ? {
                  uri: item.thumbnail,
                }
              : require("../assets/icons/video-thumbnail.png")
          }
          style={{
            height: 80,
            maxWidth: (80 / 9) * 16,
            flex: 3,

            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            resizeMode: "cover",
          }}
        />
        <View style={{ flex: 4, padding: 6, alignContent: "center" }}>
          <Text style={[styles.h4]}>{shorterText(item.title, 75)}</Text>
          <View>
            <Text style={[styles.h5, { color: colors.secondary }]}>
              {item.author.name}
              <Separator />
              {isNote ? (
                <Text>
                  {item.noted} {item.noted == 1 ? "note" : "notes"}
                </Text>
              ) : (
                numberWithCommas(item.views)
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <View style={{ paddingTop: 15 }}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={[styles.userTag]}>{userData.title}</Text>
        </View>
        <Menu />

        <View style={{ ...defaultStyles.shadow }}>
          <View style={styles.card}>
            <View style={styles.cardBody}>
              <View>
                {activeTab == "starred" && (
                  <View>
                    {starredLectures && starredLectures.length > 0 ? (
                      starredLectures.map((lecture) => {
                        return renderItem(lecture, false);
                      })
                    ) : (
                      <View style={styles.default_card}>
                        <View style={[styles.cardBody, styles.padded]}>
                          <Text style={{ color: colors.text }}>
                            You do not have any starred lectures.
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                {activeTab == "notes" && (
                  <View>
                    {notes ? (
                      notes.map((lecture) => {
                        return renderItem(lecture, true);
                      })
                    ) : (
                      <View style={styles.default_card}>
                        <View style={[styles.cardBody, styles.padded]}>
                          <Text style={{ color: colors.text }}>
                            You do not have any notes yet.
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                {activeTab == "history" && (
                  <View>
                    {lectureHistory && lectureHistory.length > 0 ? (
                      lectureHistory.map((lecture) => {
                        return renderItem(lecture, false);
                      })
                    ) : (
                      <View style={styles.default_card}>
                        <View style={[styles.cardBody, styles.padded]}>
                          <Text style={{ color: colors.text }}>
                            You haven't watched any lectures yet.
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  videoID: state.video.videoID,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
