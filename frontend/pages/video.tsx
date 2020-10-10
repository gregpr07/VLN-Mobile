import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  // Pressable,
  Animated,
  Button,
} from "react-native";

import Modal from "react-native-modal";

import Constants from "expo-constants";

import { Ionicons } from "@expo/vector-icons";

import { fetcher } from "../services/fetcher";

// fetching
import useSWR from "swr";

import { connect } from "react-redux";
import { setVideoID } from "../services/actions";

// dimensions
const { width, height } = Dimensions.get("window");

import { useTheme } from "@react-navigation/native";

import VideoAudioComponent from "./video/video_audio_component";
import RecommendedVids from "./video/recommendations";
import Notes from "./video/Notes";

const videoHeight = (width / 16) * 9;

//? using let because we don't want the screen to re-render because of video

const initPager = 0;

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
    if (videoID && videoRef) {
      playVideoORAudio(initPager, 0);
    }
  }, [videoRef]);

  // currently 0 is video 1 is audio but this might change
  async function playVideoORAudio(page: number, currentPositionMillis: number) {
    const initStatus = {
      //! MAKE THIS YES
      shouldPlay: true,
      positionMillis: currentPositionMillis,
      staysActiveInBackground: true,
      shouldCorrectPitch: true,
    };

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

  const handleOrientation = async () => {
    if (videoRef) {
      console.log("orientation changed to " + isPortrait());
      const videoplaying = (await videoRef.getStatusAsync()).isLoaded;
      console.log(videoplaying);
      if (videoplaying) {
        if (isPortrait()) {
          videoRef.dismissFullscreenPlayer();
        } else {
          videoRef.presentFullscreenPlayer();
        }
      }
    }
  };
  useEffect(() => {
    handleOrientation();
  }, [orientation]);

  const [showNotes, setShowNotes] = useState(false);

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

  //* NOTES STUFF
  const parent = navigation.dangerouslyGetParent();
  parent.setOptions({
    tabBarVisible: !showNotes,
  });
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

  const Categories = () => {
    const cats = ["machine learning", "support vector machine", "mathematics"];

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
        data={cats}
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

    const SettingsModal = () => (
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
                <Ionicons name={"md-close"} size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.text }}>Playback speed</Text>
          </View>
        </View>
      </Modal>
    );

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
        <SettingsModal />
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
    marginBottom: {
      marginBottom: padding,
    },
  });

  const WarningModal = () => (
    <Modal
      isVisible={!videoID}
      //swipeDirection={["left", "down"]}
      animationIn="bounceInLeft"
      animationOut="bounceOutLeft"
      coverScreen={false}
      backdropOpacity={0.97}
      backdropColor={colors.card}
    >
      <Text style={styles.h1}>No lecture playing</Text>
    </Modal>
  );

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
      <WarningModal />
      {showNotes ? null : (
        <Animated.View
          onLayout={(event) => {
            setTitleHeight(event.nativeEvent.layout.height);
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
        playVideoORAudio={playVideoORAudio}
        slides={slides}
      />

      {showNotes ? (
        <Notes
          styles={styles}
          padding={padding}
          quitNotes={quitNotes}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: padding }}
        >
          <Categories />

          <Description />

          {/* recommendations */}

          <RecommendedVids styles={styles} colors={colors} lecture={lecture} />
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
