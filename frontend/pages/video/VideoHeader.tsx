import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button, Share } from "react-native";

import Modal from "react-native-modal";

import { connect } from "react-redux";

import { Feather } from "@expo/vector-icons";

import { useTheme } from "@react-navigation/native";

import * as Linking from "expo-linking";

import { API } from "../../services/fetcher";

import {
  setPlaybackSpeed,
  setVideoAudioPlay,
  setShowSlides,
} from "../../services/storage/actions";
import { noHeadFetcher } from "../../services/fetcher";

const VideoHeader = ({
  padding,
  styles,
  lecture,
  setPlaybackSpd,
  playbackSpeed,
  setVidAudPlay,
  videoAudioPlay,
  token,
  showSlides,
  setShowS,
  videoID,
}) => {
  const { colors, dark } = useTheme();

  /*   useEffect(() => {
    console.log(playbackSpeed);
    console.log(lecture);
  }, [playbackSpeed]); */

  const [modalVisible, setModalVisible] = useState(false);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${API}lecture/${lecture.id}/`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, []);

  const SettingsModal = () => {
    const miniPadding = (padding / 4) * 3;
    const SpeedController = () => {
      const speeds = [0.75, 1, 1.25, 1.5, 2];

      return (
        <View style={{ flexDirection: "row", paddingTop: padding / 2 }}>
          {speeds.map((speed) => (
            <TouchableOpacity
              onPress={() => {
                setPlaybackSpd(speed);
                setModalVisible(false);
              }}
              style={{
                backgroundColor:
                  playbackSpeed === speed ? colors.secondary : colors.shadow,
                padding: miniPadding,
                marginRight: miniPadding,
                borderRadius: miniPadding,
                minWidth: miniPadding * 5,
              }}
              key={speed}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: playbackSpeed === speed ? colors.card : colors.text,
                }}
              >
                {speed}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    const ChangeVideoPlayer = () => {
      const PlayerController = () => {
        const options = [0, 1];

        return (
          <View style={{ flexDirection: "row", paddingTop: padding / 2 }}>
            {options.map((option) => (
              <TouchableOpacity
                onPress={() => {
                  setVidAudPlay(option);
                  setModalVisible(false);
                }}
                style={{
                  backgroundColor:
                    videoAudioPlay === option
                      ? colors.secondary
                      : colors.shadow,
                  padding: miniPadding,
                  marginRight: miniPadding,
                  borderRadius: miniPadding,
                  minWidth: miniPadding * 5,
                }}
                key={option}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color:
                      videoAudioPlay === option ? colors.card : colors.text,
                  }}
                >
                  {option === 0 ? "Video" : "Audio/slides"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      };

      return <PlayerController />;
    };

    const ToggleSlides = () => {
      const PlayerController = () => {
        return (
          <View style={{ flexDirection: "row", paddingTop: padding / 2 }}>
            <TouchableOpacity
              onPress={() => {
                setShowS(!showSlides);
                setModalVisible(false);
              }}
              style={{
                backgroundColor: showSlides ? colors.secondary : colors.shadow,
                padding: miniPadding,
                marginRight: miniPadding,
                borderRadius: miniPadding,
                minWidth: miniPadding * 5,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: showSlides ? colors.card : colors.text,
                }}
              >
                Slides
              </Text>
            </TouchableOpacity>
          </View>
        );
      };

      return <PlayerController />;
    };

    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection={["left", "down"]}
        animationIn="bounceInLeft"
        animationOut="bounceOutLeft"
        animationInTiming={750}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={[{ maxWidth: 300, margin: 0 }, styles.default_card]}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                paddingBottom: padding,
              }}
            >
              <Text
                style={[
                  styles.h3,
                  {
                    color: colors.secondary,
                    textAlign: "center",
                    flex: 1,
                  },
                ]}
              >
                Video settings
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name={"x"} size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.h4, { color: colors.text }]}>
              Playback speed
            </Text>
            <SpeedController />
            <Text
              style={[styles.h4, { color: colors.text, paddingTop: padding }]}
            >
              Player
            </Text>
            <ToggleSlides />
            {/*! COMING SOON !*/}
            {/* <Text
              style={[styles.h4, { color: colors.text, paddingTop: padding }]}
            >
              Player
            </Text>
            <ChangeVideoPlayer /> */}
          </View>
        </View>
      </Modal>
    );
  };

  const setStar = (star: boolean) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API + (star ? "star" : "unstar") + `/${lecture.id}/`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    console.log("should be star: " + star);
    setStarred(star);
  };

  const onShare = async () => {
    const link = Linking.makeUrl("video", { id: videoID });
    try {
      const result = await Share.share({
        /*   message:
          "React Native | A framework for building native apps using React",
 */ url: link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
        onPress={() => onShare()}
        style={{ paddingHorizontal: padding / 2, paddingVertical: padding }}
      >
        <Feather name={"share"} size={20} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ paddingHorizontal: padding / 2, paddingVertical: padding }}
        onPress={() => console.log(lecture)}
      >
        {token ? (
          <Feather
            name={"star"}
            size={20}
            color={starred ? colors.primary : colors.text}
            onPress={() => setStar(starred ? false : true)}
          />
        ) : (
          <></>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={{ paddingHorizontal: padding / 2, paddingVertical: padding }}
      >
        <Feather name={"sliders"} size={20} color={colors.text} />
      </TouchableOpacity>
      <SettingsModal />
    </View>
  );
};

const mapStateToProps = (state) => ({
  token: state.token.token,
  playbackSpeed: state.video.playbackSpeed,
  videoAudioPlay: state.video.videoAudioPlay,
  showSlides: state.video.showSlides,
  videoID: state.video.videoID,
});

const mapDispatchToProps = (dispatch) => ({
  setPlaybackSpd: (num: number) => dispatch(setPlaybackSpeed(num)),
  setVidAudPlay: (num: number) => dispatch(setVideoAudioPlay(num)),
  setShowS: (data: any) => dispatch(setShowSlides(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoHeader);
