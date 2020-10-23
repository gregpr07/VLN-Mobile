import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import Modal from "react-native-modal";

import { connect } from "react-redux";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@react-navigation/native";

import { setPlaybackSpeed, setVideoAudioPlay } from "../../services/actions";
import {noHeadFetcher} from "../../services/fetcher";

const VideoHeader = ({
  padding,
  styles,
  lecture,
  setPlaybackSpd,
  playbackSpeed,
  setVidAudPlay,
  videoAudioPlay,
  token,
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
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
      };

      fetch(`http://vln-mobile.ijs.si/api/lecture/${lecture.id}/`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
  }, []);

  const SettingsModal = () => {
    const SpeedController = () => {
      const speeds = [0.75, 1, 1.25, 1.5, 2];

      const miniPadding = (padding / 4) * 3;

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

        const miniPadding = (padding / 4) * 3;

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
                <Ionicons name={"md-close"} size={24} color={colors.primary} />
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
            <ChangeVideoPlayer />
          </View>
        </View>
      </Modal>
    );
  };

  const setStar = (star: boolean) => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);

      const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
      };

      fetch("http://vln-mobile.ijs.si/api/" + (star ? "star" : "unstar") + `/${lecture.id}/`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

      console.log("should be star: " + star);
      setStarred(star);
  }

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
        onPress={() => console.log(lecture)}
      >
      {token ?
          starred ?
              <Ionicons name={"ios-star"} size={20} color={colors.text} onPress={() => setStar(false)} /> :
              <Ionicons name={"ios-star-outline"} size={20} color={colors.text} onPress={() => setStar(true)} />
          :
          <Ionicons name={"ios-star-outline"} size={20} color={colors.text} />
      }
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

const mapStateToProps = (state) => ({
  token: state.token.token,
  playbackSpeed: state.video.playbackSpeed,
  videoAudioPlay: state.video.videoAudioPlay,
});

const mapDispatchToProps = (dispatch) => ({
  setPlaybackSpd: (num: number) => dispatch(setPlaybackSpeed(num)),
  setVidAudPlay: (num: number) => dispatch(setVideoAudioPlay(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoHeader);
