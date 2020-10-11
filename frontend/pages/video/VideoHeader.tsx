import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import Modal from "react-native-modal";

import { connect } from "react-redux";

import { setVideoID, setVideoRef } from "../../services/actions";

import { API } from "../../services/fetcher";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@react-navigation/native";

import { setPlaybackSpeed } from "../../services/actions";

const VideoHeader = ({
  padding,
  styles,
  lecture,
  setPlaybackSpd,
  playbackSpeed,
}) => {
  const { colors, dark } = useTheme();

  useEffect(() => {
    console.log(playbackSpeed);
  }, [playbackSpeed]);

  const [modalVisible, setModalVisible] = useState(false);

  const SettingsModal = () => {
    const SpeedController = () => {
      const speeds = [0.75, 1, 1.25, 1.5, 2];

      const miniPadding = (padding / 4) * 3;

      return (
        <View style={{ flexDirection: "row", paddingTop: padding }}>
          {speeds.map((speed) => (
            <TouchableOpacity
              onPress={() => setPlaybackSpd(speed)}
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
          </View>
        </View>
      </Modal>
    );
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

const mapStateToProps = (state) => ({
  playbackSpeed: state.video.playbackSpeed,
});

const mapDispatchToProps = (dispatch) => ({
  setPlaybackSpd: (num: number) => dispatch(setPlaybackSpeed(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoHeader);
