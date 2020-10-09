import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import ViewPager from "@react-native-community/viewpager";

import * as Updates from "expo-updates";

import { Video, Audio } from "expo-av";

import { connect } from "react-redux";
import { setVideoID, setVideoRef } from "../services/actions";

let component: any;

const MyPager = ({ navigation, videoRef, audioRef, videoID, setVidID }) => {
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Button onPress={() => Updates.reloadAsync()} title="reload app" />

      <Button onPress={() => videoRef.playAsync()} title="ref" />
    </View>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 0.5,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontFamily: "SF-UI-medium",
  },
});

const mapStateToProps = (state) => ({
  token: state.token.token,
  videoID: state.video.videoID,
  audioRef: state.video.audioRef,
  videoRef: state.video.videoRef,
  /*   videoRef: state.video.videoRef, */
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(MyPager);
