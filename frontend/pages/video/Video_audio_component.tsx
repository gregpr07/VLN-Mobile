import React, { useState, useEffect, useRef } from "react";
import {
  View,
  // Pressable,
  Animated,
  TouchableHighlight,
  FlatList,
  ImageBackground,
  Platform,
} from "react-native";

import { connect } from "react-redux";

/* import ViewPager from "@react-native-community/viewpager"; */
import { Video } from "expo-av";

import { setVideoID, setVideoRef } from "../../services/actions";

import { compare } from "../../services/functions";
import { useTheme } from "@react-navigation/native";

let component: any;

let currentPositionMillis: number = 0;

let currentSlide: number;

const VideoAudio = ({
  SpringAnim,
  initPager,
  videoHeight,
  videostyle,
  videoRef,
  setVidRef,
  audioRef,
  playVideoORAudio,
  slides,
  videoID,
  lecture,
  videoAudioPlay,
}: any) => {
  const { colors, dark } = useTheme();

  useEffect(() => {
    if (videoID && videoRef) {
      playVideoORAudio(videoAudioPlay, currentPositionMillis);
    }
  }, [videoAudioPlay]);

  const getCurrentSlide = () => {
    const newslides = slides
      ? slides.results
          .sort(compare)
          .filter((slide) => slide.timestamp < currentPositionMillis)
      : [];
    if (!newslides.length) {
      return null;
    }
    return newslides.length - 1;
  };

  // this is set when dealing with video loop
  const onPlaybackStatusUpdate = (status: any) => {
    currentPositionMillis = status.positionMillis;

    //! change timestamp
    //handleSlideChange();
    const gotSlide = getCurrentSlide();
    if (gotSlide !== currentSlide && gotSlide !== null && slidesRef.current) {
      //setCurrSlide(gotSlide);

      console.log("slide should change to: " + gotSlide);

      slidesRef.current.scrollToIndex({ index: gotSlide });
      currentSlide = gotSlide;
    }
  };

  async function _handleVideoRef(ref: any) {
    if (videoRef !== ref && ref) {
      //ref.loadAsync()
      try {
        await ref.getStatusAsync();
        component = ref;
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

  const slidesRef = useRef(null);

  /*   const handleVideoAudioChange = (pos: number) => {
    if (videoRef && videoID) {
      playVideoORAudio(pos, currentPositionMillis);
    }
  }; */

  const AudioSlides = () => {
    //const slidesarray = slides.map((slide) => slide.url);

    const [playing, setPlaying] = useState(true);

    async function handlePausePlay() {
      if (playing) {
        await audioRef.pauseAsync();
      } else {
        await audioRef.playAsync();
      }
      setPlaying(!playing);
    }

    const RenderSlide = ({ item }) => (
      <ImageBackground
        source={{
          uri: item.image,
        }}
        style={[videostyle, { backgroundColor: colors.background }]}
        resizeMode="contain"
      />
    );

    if (slides) {
      /*       const slides_results = slides.results.map((res) => {
        return { image: res.image, id: res.id };
      }); */

      return (
        //! write this by hand
        <TouchableHighlight onPress={handlePausePlay}>
          <FlatList
            ref={slidesRef}
            data={slides.results}
            renderItem={RenderSlide}
            style={[
              videostyle,
              videoAudioPlay === 1 ? null : { height: 0 },
              { backgroundColor: colors.background },
            ]}
            horizontal
            keyExtractor={(item) => item.image + item.id}
            onScrollToIndexFailed={(index) =>
              console.log("failed to scroll to " + index)
            }
          />
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  };

  //console.log(SpringAnim)
  return (
    <Animated.View
      style={{
        transform: [{ translateY: SpringAnim }],
      }}
    >
      {/*       <ViewPager
        initialPage={initPager}
        style={{
          height: videoHeight, // - 2 * padding
        }}
        pageMargin={100}
        //! this line causes the error which reloades on every state change
        onPageSelected={(e) => {
          //currentPager = e.nativeEvent.position;
          handleVideoAudioChange(e.nativeEvent.position);
        }}
      > */}
      <View
        style={
          videoAudioPlay === 1
            ? { height: 0 }
            : {
                height: videoHeight, // - 2 * padding
              }
        }
      >
        {/*  <ImageBackground
          key="0"
          source={
            dark
              ? require("../../assets/icons/videolecture-net-dark.png")
              : require("../../assets/icons/videolecture-net-light.png")
          }
          resizeMode="contain"
        > */}
        <Video
          ref={(component) => _handleVideoRef(component)}
          //isLooping={false}
          style={videostyle}
          source={{ uri: lecture ? lecture.video : "" }}
          useNativeControls={true}
        />
      </View>

      {/*   </ImageBackground>
        <ImageBackground 
          key="1"
          source={
            dark
              ? require("../../assets/icons/videolecture-net-dark.png")
              : require("../../assets/icons/videolecture-net-light.png")
          }
          resizeMode="contain"
        >  */}
      <AudioSlides />
      {/* </ImageBackground> */}

      {/* </ViewPager> */}
    </Animated.View>
  );
};

const mapStateToProps = (state) => ({
  token: state.token.token,
  videoID: state.video.videoID,
  videoRef: state.video.videoRef,
  audioRef: state.video.audioRef,
  videoAudioPlay: state.video.videoAudioPlay,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
  setVidRef: (data: any) => dispatch(setVideoRef(data)),
  setCurrSlide: (num: number) => dispatch(setCurrentSlide(num)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(VideoAudio);
