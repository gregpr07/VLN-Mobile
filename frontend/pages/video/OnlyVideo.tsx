import React, { useState, useEffect, useRef } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Video } from "expo-av";

import {
  setVideoID,
  setVideoRef,
  setShowSlides,
} from "../../services/storage/actions";

import { connect } from "react-redux";

const OnlyVideo = ({
  videoRef,
  audioRef,
  setVidRef,
  onPlaybackStatusUpdate,
}) => {
  const { width, height } = useWindowDimensions();
  const videoHeight = (width / 16) * 9;

  async function _handleVideoRef(ref: any) {
    if (videoRef !== ref && ref) {
      //ref.loadAsync()
      try {
        await ref.getStatusAsync();
        setVidRef(ref);

        if (Platform.OS !== "web") {
          ref.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }

        audioRef.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      } catch (e) {
        console.log("cant set video ref");
      }
    }
  }

  return (
    <Video
      ref={(component) => _handleVideoRef(component)}
      //isLooping={false}
      style={{
        //borderRadius: 32,
        height: videoHeight, //- 2 * padding
        width: width, // - 2 * padding,
        maxWidth: "100%",
      }}
      /* source={{ uri: lecture ? lecture.video : "" }} */
      useNativeControls={true}
      resizeMode="contain"
    />
  );
};

const mapStateToProps = (state) => ({
  token: state.token.token,
  videoID: state.video.videoID,
  videoRef: state.video.videoRef,
  audioRef: state.video.audioRef,
  videoAudioPlay: state.video.videoAudioPlay,
  showSlides: state.video.showSlides,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
  setVidRef: (data: any) => dispatch(setVideoRef(data)),
  setShowS: (data: any) => dispatch(setShowSlides(data)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(OnlyVideo);
