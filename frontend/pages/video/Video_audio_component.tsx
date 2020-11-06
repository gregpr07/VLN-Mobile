import React, { useState, useEffect, useRef } from "react";
import {
  View,
  // Pressable,
  Animated,
  TouchableHighlight,
  FlatList,
  ImageBackground,
  Platform,
  useWindowDimensions,
  Text,
} from "react-native";

import { connect } from "react-redux";

/* import ViewPager from "@react-native-community/viewpager"; */
import { Video } from "expo-av";

import {
  setVideoID,
  setVideoRef,
  setShowSlides,
} from "../../services/storage/actions";

import { compare } from "../../services/functions";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

let component: any;

let currentPositionMillis: number = 0;

let currentSlide: number = 0;

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
  showSlides,
  setShowS,
}: any) => {
  const { colors, dark } = useTheme();
  const windowWidth = useWindowDimensions().width;

  const slidesRef = useRef(null);

  useEffect(() => {
    if (videoID && videoRef) {
      playVideoORAudio(videoAudioPlay, currentPositionMillis);
    }
    moveToCurrentSlide();
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

  const moveToCurrentSlide = () => {
    //! change timestamp
    //handleSlideChange();
    const gotSlide = getCurrentSlide();
    /* console.log(gotSlide, currentSlide); */
    if (gotSlide !== currentSlide && gotSlide !== null) {
      //setCurrSlide(gotSlide);

      /* slidesRef.current.scrollToIndex({ index: gotSlide }); */

      currentSlide = gotSlide;
      if (slidesRef.current) {
        /*  console.log("scrolling to index " + currentSlide); */
        slidesRef.current.scrollToIndex({ index: currentSlide });
      }
    }
  };

  // this is set when dealing with video loop
  const onPlaybackStatusUpdate = (status: any) => {
    currentPositionMillis = status.positionMillis;

    moveToCurrentSlide();
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

  /*   const handleVideoAudioChange = (pos: number) => {
    if (videoRef && videoID) {
      playVideoORAudio(pos, currentPositionMillis);
    }
  }; */

  const AudioSlides = () => {
    //const slidesarray = slides.map((slide) => slide.url);

    /*     const [playing, setPlaying] = useState(true);

    async function handlePausePlay() {
      if (playing) {
        await audioRef.pauseAsync();
      } else {
        await audioRef.playAsync();
      }
      setPlaying(!playing);
    } */
    const handleSlidePress = async (index: number) => {
      const audioplaying = (await audioRef.getStatusAsync()).isLoaded;
      const videoplaying = (await videoRef.getStatusAsync()).isLoaded;

      const timestamp = slides.results[index].timestamp;

      if (videoplaying) {
        videoRef.setPositionAsync(timestamp);
      }
      if (audioplaying) {
        audioRef.setPositionAsync(timestamp);
      }
    };

    const RenderSlide = ({ item, index }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={(item) => handleSlidePress(index)}
      >
        <ImageBackground
          source={{
            uri: item.image,
          }}
          style={[videostyle, { backgroundColor: colors.background }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );

    if (slides) {
      /*       const slides_results = slides.results.map((res) => {
        return { image: res.image, id: res.id };
      }); */

      return (
        //! write this by hand

        <FlatList
          ref={slidesRef}
          data={slides.results}
          renderItem={RenderSlide}
          style={[
            videostyle,
            videoAudioPlay === 1 || showSlides ? null : { display: "none" },
            { backgroundColor: colors.background },
          ]}
          initialScrollIndex={currentSlide}
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(item) => item.image + item.id}
          onScrollToIndexFailed={(item) => console.log(item.index)}
          //pagingEnabled={true}
          snapToInterval={windowWidth}
        />
      );
    } else {
      return null;
    }
  };

  //console.log(SpringAnim)
  return (
    <Animated.View
      style={
        {
          //transform: [{ translateY: SpringAnim }],
        }
      }
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
          resizeMode="contain"
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
  showSlides: state.video.showSlides,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
  setVidRef: (data: any) => dispatch(setVideoRef(data)),
  setShowS: (data: any) => dispatch(setShowSlides(data)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(VideoAudio);
