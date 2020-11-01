import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  // Pressable,
  Animated,
  Button,
  Dimensions,
} from "react-native";

import Modal from "react-native-modal";

import { Audio } from "expo-av";

import Constants from "expo-constants";

import { Ionicons } from "@expo/vector-icons";

import { fetcher, noHeadFetcher } from "../services/fetcher";

import { connect } from "react-redux";
import { setVideoID } from "../services/storage/actions";

import { useTheme } from "@react-navigation/native";

import VideoAudioComponent from "./video/Video_audio_component";
import RecommendedVids from "./video/Recommendations";
import Notes from "./video/Notes";
import VideoHeader from "./video/VideoHeader";

import { numberWithCommas } from "../services/functions";

import Categories from "../components/CategoriesList";

//? using let because we don't want the screen to re-render because of video

const TABLET_WIDTH = 800;

//TODO BUGS
// - when going to audio and opening notes the continuity breakes

function VideoScreen({
  route,
  navigation,
  token,
  audioRef,
  videoID,
  videoRef,
  playbackSpeed,
  videoAudioPlay,
}: any) {
  const { colors, dark } = useTheme();

  //const { data: lecture } = useSWR("lecture/" + videoID, fetcher);
  //const { data: slides } = useSWR("slide/lecture/" + videoID, fetcher);

  const [lecture, setLecture] = useState(null);
  const [slides, setSlides] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoID) {
      setLoading(true);
      noHeadFetcher("lecture/" + videoID + "/").then((json) => {
        setLecture(json);
        setLoading(false);
      });
      noHeadFetcher("slide/lecture/" + videoID).then((json) => setSlides(json));
    }
  }, [videoID]);

  //* constants
  const { width, height } = useWindowDimensions();
  const videoHeight = (width / 16) * 9;

  const isTablet = width > TABLET_WIDTH;

  //* VIDEO AND AUDIO REFERENCES

  useEffect(() => {
    if (videoID && videoRef) {
      playVideoORAudio(videoAudioPlay, 0);
    }
  }, [videoRef]);

  useEffect(() => {
    if (videoID && videoRef) {
      setVideoAudioPreferences();
    }
  }, [playbackSpeed]);

  async function setVideoAudioPreferences() {
    try {
      console.log("cakked preferences");

      let preferences = {
        shouldPlay: true,
        staysActiveInBackground: true,
        shouldCorrectPitch: true,
        pitchCorrectionQuality: Audio.PitchCorrectionQuality.Medium,
        rate: playbackSpeed,
      };

      if (playbackSpeed !== 1) {
        preferences = {
          ...preferences,
          shouldCorrectPitch: true,
          pitchCorrectionQuality: Audio.PitchCorrectionQuality.Medium,
        };
      }

      const audioplaying = (await audioRef.getStatusAsync()).isLoaded;
      const videoplaying = (await videoRef.getStatusAsync()).isLoaded;

      if (audioplaying) {
        audioRef.setStatusAsync(preferences);
      }
      if (videoplaying) {
        videoRef.setStatusAsync(preferences);
      }
    } catch (e) {
      console.log("cant play");
    }
  }

  // currently 0 is video 1 is audio but this might change
  async function playVideoORAudio(page: number, currentPositionMillis: number) {
    console.log("playvideooraudio called");
    try {
      let initStatus = {
        //! MAKE THIS YES
        shouldPlay: true,
        positionMillis: currentPositionMillis,
        staysActiveInBackground: true,
        rate: playbackSpeed,
      };

      if (playbackSpeed !== 1) {
        initStatus = {
          ...initStatus,
          shouldCorrectPitch: true,
          pitchCorrectionQuality: Audio.PitchCorrectionQuality.Medium,
        };
      }

      const audioplaying = (await audioRef.getStatusAsync()).isLoaded;
      const videoplaying = (await videoRef.getStatusAsync()).isLoaded;

      if (page === 0) {
        if (audioplaying) {
          await audioRef.unloadAsync();
        }
        console.log("loading video");

        if (!videoplaying) {
          await videoRef.loadAsync(
            {
              uri: lecture.video,
            },
            initStatus
          );
          console.log("video loaded");
        }
      }
      if (page === 1) {
        if (videoplaying) {
          await videoRef.unloadAsync();
        }
        console.log("loading audio");
        if (!audioplaying) {
          await audioRef.loadAsync(
            {
              uri: lecture.audio,
            },
            initStatus
          );
          console.log("audio loaded");
        }
      }
    } catch (e) {
      console.log("cant play");
    }
  }

  // HANDLE FULLSCREEN ON ROTATION
  const isPortrait = () => {
    return height >= width;
  };
  const [orientation, setOrientation] = useState(isPortrait());
  //! TABLETS NOT SUPPORT FULLSCREEN
  if (!isTablet) {
    Dimensions.addEventListener("change", () => {
      if (isPortrait() !== orientation) {
        setOrientation(isPortrait());
      }
    });
  }

  const handleOrientation = async () => {
    if (videoRef) {
      console.log("orientation changed to " + isPortrait());
      try {
        const videoplaying = (await videoRef.getStatusAsync()).isLoaded;
        if (videoplaying) {
          if (isPortrait()) {
            videoRef.dismissFullscreenPlayer();
          } else {
            videoRef.presentFullscreenPlayer();
          }
        }
      } catch (e) {
        console.log("cant orientate");
      }
    }
  };
  /*   useEffect(() => {
    if (!isTablet) {
      handleOrientation();
    }
  }, [orientation]); */

  const [showNotes, setShowNotes] = useState(false);

  const Description = () =>
    lecture.author ? (
      <View style={styles.default_card}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "author",
                  params: {
                    authorID: lecture.author.id,
                  },
                })
              }
            >
              <Image
                //? Shows author image otherwise thumbhnail of the video
                //? --> good because video thumbnails are mostly author heads
                source={{
                  uri: lecture.author.image
                    ? lecture.author.image
                    : lecture.thumbnail,
                }}
                style={{
                  height: 75,
                  width: 75,
                  borderRadius: 50,

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
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.h5}>
              <Text style={styles.gray}>views:</Text>{" "}
              {numberWithCommas(lecture.views)}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "author",
                  params: {
                    authorID: lecture.author.id,
                  },
                })
              }
            >
              <Text style={styles.h5}>
                <Text style={styles.gray}>author:</Text> {lecture.author.name}
              </Text>
            </TouchableOpacity>
            <Text style={styles.h5}>
              <Text style={styles.gray}>published:</Text> {lecture.published}
            </Text>
            {lecture.event ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Home", {
                    screen: "event",
                    params: {
                      eventID: lecture.event.id,
                      eventTitle: lecture.event.caption,
                    },
                  })
                }
              >
                <Text
                  style={[styles.h5, { paddingTop: 4, color: colors.primary }]}
                >
                  {lecture.event.caption}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    ) : null;

  //* NOTES STUFF
  //? this function doesn't work with latest expo
  /*   const parent = navigation.dangerouslyGetParent();
  parent.setOptions({
    tabBarVisible: !showNotes,
  }); */
  const quitNotes = () => {
    setShowNotes(false);
    SpringIn();
    FadeIn();
  };
  // when press it switches to notes, on long press it goes to add new note screen
  const SwitchToNotes = () => {
    const handleSwitch = () => {
      if (token) {
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

  // ANIMATIONS

  const [titleHeight, setTitleHeight] = useState(0);

  const SpringAnim = useRef(new Animated.Value(0)).current;
  const OpacityAnim = useRef(new Animated.Value(1)).current;

  const SPRING_VAL = titleHeight;
  const SpringIn = () => {
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
      color: colors.text,
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
      maxWidth: "100%",
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
    marginBottom: {
      marginBottom: padding,
    },
  });

  const WarningModal = () =>
    videoID ? null : (
      <Modal
        isVisible={!videoID}
        //swipeDirection={["left", "down"]}
        animationIn="bounceInLeft"
        animationOut="fadeOut"
        animationOutTiming={100}
        coverScreen={false}
        backdropOpacity={0.97}
        backdropColor={colors.card}
      >
        <Text style={styles.h1}>No lecture playing</Text>
      </Modal>
    );

  if (loading) {
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
      <WarningModal />
      {lecture ? (
        showNotes ? null : (
          <Animated.View
            onLayout={(event) => {
              setTitleHeight(event.nativeEvent.layout.height);
            }}
            style={{
              opacity: OpacityAnim,
              paddingHorizontal: padding,
            }}
          >
            <VideoHeader styles={styles} padding={padding} lecture={lecture} />
          </Animated.View>
        )
      ) : null}

      {/* VideoAudio */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <VideoAudioComponent
          SpringAnim={SpringAnim}
          //initPager={initPager}
          videoHeight={videoHeight}
          videostyle={styles.video}
          playVideoORAudio={playVideoORAudio}
          slides={slides}
          lecture={lecture}
        />
        {lecture ? (
          showNotes ? (
            <Notes
              styles={styles}
              padding={padding}
              quitNotes={quitNotes}
              showNotes={showNotes}
              setShowNotes={setShowNotes}
            />
          ) : (
            <View style={{ paddingHorizontal: padding }}>
              <Categories
                cats={lecture.categories}
                navigation={navigation}
                colors={colors}
                padding={padding}
              />

              <Description />

              {/* recommendations */}

              <RecommendedVids
                styles={styles}
                colors={colors}
                lecture={lecture}
                padding={padding}
              />
            </View>
          )
        ) : null}
      </ScrollView>

      {showNotes ? null : <SwitchToNotes />}
    </View>
  );
}

const mapStateToProps = (state) => ({
  token: state.token.token,
  videoID: state.video.videoID,
  audioRef: state.video.audioRef,
  videoRef: state.video.videoRef,
  playbackSpeed: state.video.playbackSpeed,
  videoAudioPlay: state.video.videoAudioPlay,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen);
