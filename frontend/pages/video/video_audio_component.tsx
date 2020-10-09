import React, { useState, useEffect, useRef } from "react";
import {
  View,
  // Pressable,
  Animated,
  Button,
} from "react-native";

import { connect } from "react-redux";

import ViewPager from "@react-native-community/viewpager";
import { Video, Audio } from "expo-av";

import { setVideoID, setVideoRef } from "../../services/actions";

let component: any;

const VideoAudio = ({
  SpringAnim,
  initPager,
  videoHeight,
  videostyle,
  videoRef,
  setVidRef,
  audioRef,
}: any) => {
  // this is set when dealing with video
  const onPlaybackStatusUpdate = (status: any) => {
    //console.log(status.positionMillis);
    const currentPositionMillis = status.positionMillis;
    //videoIsLoaded = status.isLoaded;
    //console.log(currentPositionMillis);

    //! change timestamp
    //handleSlideChange();
  };

  async function _handleVideoRef(ref: any) {
    if (videoRef !== ref && ref) {
      //ref.loadAsync()
      ref.getStatusAsync().then((res) => {
        component = ref;
        setVidRef(ref);
      });
    }
  }

  /* const AudioSlides = () => {
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
  }; */

  return (
    <Animated.View
      style={{
        transform: [{ translateY: SpringAnim }],
      }}
    >
      <ViewPager
        initialPage={initPager}
        style={{
          height: videoHeight, // - 2 * padding
        }}
        pageMargin={100}
        //! this line causes the error which reloades on every state change
        /*         onPageSelected={(e) => {
          currentPager = e.nativeEvent.position;
          if (videoRef) {
            playVideoORAudio(e.nativeEvent.position);
          }
        }} */
      >
        <View key="0">
          <Video
            ref={(component) => _handleVideoRef(component)}
            /*             source={{
              uri:
                "http://hydro.ijs.si/v017/1e/dzsgmwtdhya3gbrgyuw4sgjltupqziev.mp4",
            }} */
            /*             posterSource={{
              uri:
                "http://hydro.ijs.si/v017/26/ezjkw3457s667gha3tjyoun647iwbqqu.jpg",
            }} */
            resizeMode={Video.RESIZE_MODE_COVER}
            usePoster={true}
            shouldPlay={true}
            //isLooping={false}
            style={videostyle}
            useNativeControls={true}
          />
        </View>
        {/* <AudioSlides key="1" /> */}
      </ViewPager>
    </Animated.View>
  );
};

const mapStateToProps = (state) => ({
  token: state.token.token,
  videoID: state.video.videoID,
  videoRef: state.video.videoRef,
  audioRef: state.video.audioRef,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
  setVidRef: (data: any) => dispatch(setVideoRef(data)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(VideoAudio);
