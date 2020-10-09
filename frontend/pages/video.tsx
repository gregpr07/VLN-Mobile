import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  TextInput,
  Keyboard,
  ActivityIndicator,
  // Pressable,
  Animated,
} from "react-native";

import Modal from "react-native-modal";

import Constants from "expo-constants";

import { Ionicons } from "@expo/vector-icons";

// @ts-ignore
import Slideshow from "react-native-image-slider-show";

// functions
import { YoutubeTime, shorterText, compare } from "../services/functions";

import { fetcher, API } from "../services/fetcher";

// expo
import { Video, Audio } from "expo-av";
import ViewPager from "@react-native-community/viewpager";

// fetching
import useSWR from "swr";

import { connect } from "react-redux";
import { setVideoID } from "../services/actions";

// dimensions
const { width, height } = Dimensions.get("window");

import { useTheme } from "@react-navigation/native";
import { color } from "react-native-reanimated";

import VideoAudioComponent from "./video/video_audio_component";

const videoHeight = (width / 16) * 9;

//? using let because we don't want the screen to re-render because of video
let currentPositionMillis: number;
let videoIsLoaded: boolean;
let videoplaying: boolean;
let audioplaying: boolean;

const initPager = 0;
let currentPager = initPager;

let shouldUpdate: boolean;

//TODO BUGS
// - when going to audio and opening notes the continuity breakes

function VideoScreen({
  route,
  navigation,
  token,
  audioRef,
  videoID,
  setVidID,
  videoRef,
}: any) {
  const { colors, dark } = useTheme();

  const { data: lecture } = useSWR("lecture/" + videoID, fetcher);
  const { data: slides } = useSWR("slide/lecture/" + videoID, fetcher);

  //* constants

  //* VIDEO AND AUDIO REFERENCES

  useEffect(() => {
    if (lecture && videoRef) {
      playVideoORAudio(currentPager);
    }
  }, [videoRef]);

  // currently 0 is video 1 is audio but this might change
  async function playVideoORAudio(page: number) {
    console.log("calling video");

    const initStatus = {
      //! MAKE THIS YES
      shouldPlay: true,
      positionMillis: currentPositionMillis,
      staysActiveInBackground: true,
      shouldCorrectPitch: true,
    };

    if (page === 0) {
      if (audioplaying) {
        await audioRef.unloadAsync();
        audioplaying = false;
      }
      console.log("loading video");

      await videoRef.loadAsync(
        {
          uri: lecture.video,
        },
        initStatus
      );
      console.log("video loaded");
      videoplaying = true;
    }
    if (page === 1) {
      if (videoplaying) {
        await videoRef.unloadAsync();
        videoplaying = false;
      }
      if (!audioplaying) {
        await audioRef.loadAsync(
          {
            uri: lecture.audio,
          },
          initStatus
        );
        audioplaying = true;
      }
    }
  }

  // HANDLE FULLSCREEN ON ROTATION
  const isPortrait = () => {
    const dim = Dimensions.get("screen");
    return dim.height >= dim.width;
  };
  const [orientation, setOrientation] = useState(isPortrait());
  Dimensions.addEventListener("change", () => {
    if (isPortrait() !== orientation) {
      setOrientation(isPortrait());
    }
  });
  useEffect(() => {
    console.log("orientation changed to " + isPortrait());
    console.log(videoIsLoaded);
    if (videoIsLoaded) {
      if (isPortrait()) {
        videoRef.dismissFullscreenPlayer();
      } else {
        videoRef.presentFullscreenPlayer();
      }
    }
  }, [orientation]);

  const handleTimestamp = (timestamp: number) => {
    if (currentPager === 0) {
      videoRef.setPositionAsync(timestamp);
    }
    if (currentPager === 1) {
      audioRef.setPositionAsync(timestamp);
    }
    //console.log(videoRef);
  };

  const AudioSlides = () => {
    //const slidesarray = slides.map((slide) => slide.url);
    const [slidePosition, setSlidePosition] = useState(0);

    const getCurrentSlide = () => {
      const newslides = slides
        ? slides.results
            .sort(compare)
            .filter((slide) => slide.timestamp < currentPositionMillis)
        : [];
      return newslides.length - 1;
    };

    //? this is very slow
    const handleSlideChange = () => {
      if (audioplaying) {
        setSlidePosition(getCurrentSlide());
        //console.log(newslides.length);
      }
    };

    if (slides) {
      let intervalid = setInterval(handleSlideChange, 500);

      const [playing, setPlaying] = useState(true);
      async function handlePausePlay() {
        if (playing) {
          await audioRef.pauseAsync();
        } else {
          await audioRef.playAsync();
        }
        setPlaying(!playing);
      }

      const slides_imgs = slides.results.map((res) => {
        return { url: res.image };
      });

      return (
        //! write this by hand
        <TouchableHighlight onPress={handlePausePlay}>
          <Slideshow
            //! SLIDESHOW REQUIRES NAME URL, CURRENTLY IS IMAGE
            dataSource={slides_imgs}
            position={slidePosition}
            style={styles.video}
            scrollEnabled={false}
            arrowSize={0}
            height={videoHeight}
          />
        </TouchableHighlight>
      );
    } else return null;
  };

  const recommendations = [
    {
      title:
        "This page - How Machine Learning has Finally Solved Wanamaker’s Dilemma",
      views: 2784,
      author: "Oliver Downs",
      date: "2016",
      image: "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
    },
    {
      title: "This page - How Machine ",
      views: 2233,
      author: "Oliver Downs",
      date: "2016",
      image: "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
    },
    {
      title: "Blabla video title ",
      views: 2500,
      author: "Erik Novak",
      date: "201123",
      image: "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
    },
  ];

  const [showNotes, setShowNotes] = useState(false);

  const Notes = () => {
    const ITEM_SIZE = 200;
    const SEPARATOR_SIZE = 10;

    const [notes, setNotes] = useState([]);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);

    const requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const getNotes = () => {
      fetch(API + "note/lecture/1/", requestOptions)
        .then((r) => {
          if (r.status === 200) {
            return r.json();
          } else return null;
        })
        .then((json) => {
          if (json) {
            setNotes(json.results);
          }
        })
        .catch((error) => console.log("error", error));
    };

    useEffect(() => {
      getNotes();
    }, []);

    const RenderNote = ({ item, index }: any) => {
      return (
        <View
          style={{
            paddingVertical: 6,
          }}
        >
          <TouchableHighlight onPress={() => handleTimestamp(item.timestamp)}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ color: colors.secondary }}>
                {YoutubeTime(item.timestamp)}
              </Text>
              <Ionicons
                name={"ios-play-circle"}
                size={16}
                color={colors.secondary}
                style={{ marginLeft: 5 }}
              />
            </View>
          </TouchableHighlight>

          <Text style={styles.note_text}>{item.text}</Text>
        </View>
      );
    };

    const Separator = () => (
      <View
        style={{
          //marginHorizontal: SEPARATOR_SIZE,
          borderColor: "#E8E8E8",
          borderWidth: 0.5,
        }}
      ></View>
    );

    const NoteHeader = () => {
      const [noteText, setNoteText] = useState("");
      const [timestamp, setTimestamp] = useState(0);
      const output_obj = {
        text: noteText,
        timestamp: timestamp,
      };
      const handleChangeText = (text: string) => {
        setNoteText(text);
        if (text.length === 1 && currentPositionMillis) {
          setTimestamp(currentPositionMillis);
          console.log(currentPositionMillis);
        }
      };
      const handleNoteSubmit = () => {
        if (noteText) {
          let newnotes: any = [...notes, output_obj].sort(compare);
          setNotes(newnotes);
        }
        Keyboard.dismiss();
        setNoteText("");
        console.log(output_obj);
      };
      return (
        <View
        /* keyboardShouldPersistTaps="handled" */
        >
          <View style={{}}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TextInput
                style={{
                  marginBottom: 5,

                  paddingBottom: 5,
                  flex: 9,

                  color: colors.text,
                }}
                onChangeText={handleChangeText}
                value={noteText}
                autoFocus={true}
                //onSubmitEditing={handleSubmit}
                clearButtonMode={"always"}
                multiline
                placeholder={"Add new note here"}
                placeholderTextColor="#BDBDBD"
                keyboardAppearance={dark ? "dark" : "light"}
              />
              <TouchableOpacity onPress={() => quitNotes()}>
                <Ionicons name={"ios-close"} size={30} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {noteText ? (
              <TouchableHighlight
                style={{
                  paddingVertical: 10,
                  marginBottom: 6,
                  borderRadius: 10,
                  backgroundColor: "#5468fe",

                  width: 200,

                  shadowColor: colors.shadow,
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowRadius: 25,
                  shadowOpacity: 1,
                }}
                onPress={handleNoteSubmit}
                accessible={false}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "SF-UI-medium",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Create note
                </Text>
              </TouchableHighlight>
            ) : null}
          </View>
        </View>
      );
    };
    const EmptyComponent = () => (
      <View
        style={{
          paddingVertical: 12,
        }}
      >
        <Text
          style={[
            styles.h4,
            { color: "gray", marginVertical: 20, textAlign: "center" },
          ]}
        >
          Swipe down to dismiss the notes
        </Text>
      </View>
    );

    const quitNotes = () => {
      setShowNotes(false);
      SpringIn();
      FadeIn();
    };
    const handleQuit = (props: any) => {
      const offset = 75;
      const currentY = props.nativeEvent.contentOffset.y;
      // || currentX > ITEM_SIZE + SEPARATOR_SIZE
      // ALSO NEED TO IMPLEMENT RIGHT SIDE
      if (currentY < -offset) {
        quitNotes();
      }
    };

    return (
      <View
        style={[
          styles.default_card,
          {
            margin: padding,
          },
        ]}
      >
        <SafeAreaView style={styles.your_notes}>
          <FlatList
            data={notes}
            renderItem={RenderNote}
            keyExtractor={(item) => item.text}
            //horizontal
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={NoteHeader}
            ListEmptyComponent={EmptyComponent}
            //snapToInterval
            snapToAlignment="start"
            decelerationRate={0}
            showsVerticalScrollIndicator={false}
            onScroll={handleQuit}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </SafeAreaView>
      </View>
    );
  };

  const Description = () => (
    <View style={styles.default_card}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View>
          <Image
            source={{ uri: "https://platform.x5gon.org/imgs/team/john.jpg" }}
            style={{
              height: 75,
              width: 75,
              borderRadius: 50,
              borderColor: colors.border,
              borderWidth: 5,
              marginRight: 15,

              shadowColor: colors.shadow,
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowRadius: 25,
              shadowOpacity: 1,
            }}
          />
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.h5}>
            <Text style={styles.gray}>views:</Text> {lecture.views}
          </Text>
          <Text style={styles.h5}>
            <Text style={styles.gray}>author:</Text> {lecture.author}
          </Text>
          <Text style={styles.h5}>
            <Text style={styles.gray}>published:</Text> {lecture.published}
          </Text>
          <Text style={[styles.h5, { paddingTop: 4, color: colors.primary }]}>
            SiKDD2019
          </Text>
        </View>
      </View>
    </View>
  );

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

  // when press it switches to notes, on long press it goes to add new note screen
  const SwitchToNotes = () => {
    const handleSwitch = () => {
      if (token) {
        console.log(token);
        setShowNotes(true);
        SpringOut();
      } else navigation.navigate("login");
    };

    return (
      <View
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          margin: padding,
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: "#5468ff",
            shadowColor: colors.shadow,
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowRadius: 25,
            shadowOpacity: 1,
          }}
          onPress={handleSwitch}
        >
          <Ionicons name={"ios-create"} size={30} color={"white"} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleAcceptRecc = async (recc: { views: number; title: string }) => {
    await videoRef.unloadAsync();
    await audioRef.unloadAsync();

    setVidID(recc.views);
  };

  // ANIMATIONS

  const [titleHeight, setTitlteHeight] = useState(0);

  const SpringAnim = useRef(new Animated.Value(0)).current;
  const OpacityAnim = useRef(new Animated.Value(1)).current;

  const SPRING_VAL = titleHeight;
  const SpringIn = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    SpringAnim.setValue(-SPRING_VAL);
    Animated.spring(SpringAnim, {
      toValue: 0,
      //duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const SpringOut = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    SpringAnim.setValue(SPRING_VAL);
    Animated.spring(SpringAnim, {
      toValue: 0,
      //duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const FadeIn = () => {
    OpacityAnim.setValue(0);
    Animated.spring(OpacityAnim, {
      toValue: 1,
      //duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const SpeedControll = () => {
    //const speeds = [1, 1.25, 1.5, 2];
    const speeds = [
      "machine learning",
      "support vector machine",
      "mathematics",
    ];

    const Cat = ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Home", {
            screen: "category",
            params: {
              category: item,
            },
          })
        }
      >
        <View
          style={[
            styles.default_card,
            {
              flex: 1,
            },
          ]}
        >
          <Text
            style={{
              textAlign: "center",
              color: colors.secondary,
              fontFamily: "SF-UI-medium",
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={speeds}
        renderItem={Cat}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View style={{ marginLeft: padding }} />}
        horizontal
        //snapToInterval={AUTHOR_WIDTH + SEPARATOR_WIDTH}
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
      />
    );
  };

  const VideoHeader = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            flex: 1,
            fontSize: 18,

            fontFamily: "SF-UI-regular",

            color: colors.text,

            paddingVertical: padding,
          }}
        >
          {lecture.title}
        </Text>
        <TouchableOpacity
          style={{ paddingHorizontal: padding / 2, paddingVertical: padding }}
        >
          <Ionicons name={"ios-star"} size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{ paddingHorizontal: padding / 2, paddingVertical: padding }}
        >
          <Ionicons name={"ios-options"} size={20} color={colors.text} />
        </TouchableOpacity>

        <Modal
          isVisible={modalVisible}
          onSwipeComplete={() => setModalVisible(false)}
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          swipeDirection={["left", "down"]}
          animationIn="bounceInLeft"
          animationOut="bounceOutLeft"
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={[
                { height: 100, maxWidth: 250, margin: 0 },
                styles.default_card,
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingBottom: padding,
                }}
              >
                <Text
                  style={[
                    styles.h4,
                    {
                      color: colors.secondary,
                      textAlign: "center",
                      flex: 1,
                      paddingTop: 2,
                    },
                  ]}
                >
                  Video settings
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons
                    name={"md-close"}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ color: colors.text }}>Playback speed</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const padding = 12;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      //padding: padding,
      paddingTop: Constants.statusBarHeight,
      //backgroundColor: "white",
      paddingBottom: 0,
    },
    h1: {
      fontSize: 36,
      textAlign: "center",
      fontFamily: "SF-UI-semibold",
    },

    h3: {
      fontSize: 20,
      fontFamily: "SF-UI-medium",
      color: colors.text,
    },
    h4: {
      fontSize: 16,
      fontFamily: "SF-UI-medium",
    },
    h5: {
      fontSize: 14,
      fontFamily: "SF-UI-medium",
      color: colors.text,
    },

    gray: {
      color: colors.secondary,
    },

    video: {
      //borderRadius: 32,
      height: videoHeight, //- 2 * padding
      width: width, // - 2 * padding,
    },

    recommendation: {
      paddingVertical: 8,
      flexDirection: "row",
    },
    your_notes: {
      paddingHorizontal: 8,
      marginVertical: 8,
      //backgroundColor: "white",
    },
    note_text: {
      fontFamily: "SF-UI-light",
      fontSize: 16,
      color: colors.text,
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

      marginTop: padding,

      padding: padding,
      borderRadius: 12,
    },
  });

  if (!lecture) {
    return (
      <ActivityIndicator
        //? 15 is for centering - very hacky!!
        style={{
          left: width / 2 - 15,
          top: height / 2,
          position: "absolute",
        }}
        size="small"
      />
    );
  }

  return (
    <View style={styles.container}>
      {showNotes ? null : (
        <Animated.View
          onLayout={(event) => {
            setTitlteHeight(event.nativeEvent.layout.height);
          }}
          style={{
            opacity: OpacityAnim,
            paddingHorizontal: padding,
          }}
        >
          <VideoHeader />
        </Animated.View>
      )}
      {/* VideoAudio */}
      <VideoAudioComponent
        SpringAnim={SpringAnim}
        initPager={initPager}
        videoHeight={videoHeight}
        videostyle={styles.video}
      />

      {showNotes ? (
        <Notes />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: padding }}
        >
          <SpeedControll />

          <Description />

          {/* recommendations */}

          <View style={styles.default_card}>
            <Text style={styles.h3}>Related videos</Text>
            {recommendations.map((recc) => (
              <TouchableOpacity
                onPress={() => handleAcceptRecc(recc)}
                key={recc.title}
                style={styles.recommendation}
              >
                <Image
                  source={{ uri: recc.image }}
                  style={{
                    height: 60,
                    maxWidth: (60 / 9) * 16,
                    flex: 2,
                    borderRadius: 8,
                    resizeMode: "cover",
                  }}
                />
                <View
                  style={{
                    flex: 3,
                    paddingHorizontal: 10,
                    //justifyContent: "center",
                  }}
                >
                  <Text style={styles.h5}>{shorterText(recc.title, 50)}</Text>
                  <View>
                    <Text style={[styles.h5, { color: colors.secondary }]}>
                      {/* {recc.views}
                      <Separator /> */}
                      {recc.author}
                      <Separator />
                      {recc.date}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {showNotes ? null : <SwitchToNotes />}
    </View>
  );
}

const mapStateToProps = (state) => ({
  token: state.token.token,
  videoID: state.video.videoID,
  audioRef: state.video.audioRef,
  videoRef: state.video.videoRef,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen);
