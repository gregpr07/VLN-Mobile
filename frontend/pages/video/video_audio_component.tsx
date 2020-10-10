import React, { useState, useEffect, useRef } from "react";
import {
  View,
  // Pressable,
  Animated,
  Button,
  TouchableHighlight,
  FlatList,
  Image,
  Text,
} from "react-native";

import { connect } from "react-redux";

import ViewPager from "@react-native-community/viewpager";
import { Video, Audio } from "expo-av";

import { setVideoID, setVideoRef } from "../../services/actions";

import { compare } from "../../services/functions";

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
}: any) => {
  const getCurrentSlide = () => {
    const newslides = slides
      ? slides.results
          .sort(compare)
          .filter((slide) => slide.timestamp < currentPositionMillis)
      : [];
    if (!newslides.length) {
      return 0;
    }
    return newslides.length - 1;
  };

  // this is set when dealing with video loop
  const onPlaybackStatusUpdate = (status: any) => {
    currentPositionMillis = status.positionMillis;

    //! change timestamp
    //handleSlideChange();
    const gotSlide = getCurrentSlide();
    if (gotSlide !== currentSlide && slidesRef) {
      //setCurrSlide(gotSlide);

      console.log("slide should change to: " + gotSlide);

      slidesRef.current.scrollToIndex({ index: gotSlide });
      currentSlide = gotSlide;
    }
  };

  async function _handleVideoRef(ref: any) {
    if (videoRef !== ref && ref) {
      //ref.loadAsync()
      ref.getStatusAsync().then((res) => {
        component = ref;
        setVidRef(ref);

        ref.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        audioRef.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      });
    }
  }

  const slidesRef = useRef(null);

  const handleVideoAudioChange = (pos: number) => {
    if (videoRef) {
      playVideoORAudio(pos, currentPositionMillis);
    }
  };

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
      <Image
        source={{
          uri: item.image,
        }}
        style={videostyle}
        resizeMode="contain"
      />
    );

    if (slides) {
      const slides_results = slides.results.map((res) => {
        return { image: res.image, id: res.id };
      });

      return (
        //! write this by hand
        <TouchableHighlight onPress={handlePausePlay}>
          {/*  <Slideshow
            //! SLIDESHOW REQUIRES NAME URL, CURRENTLY IS IMAGE
            dataSource={slides_imgs}
            position={currentSlide}
            style={videostyle}
            scrollEnabled={false}
            arrowSize={0}
            height={videoHeight}
          /> */}
          <FlatList
            ref={slidesRef}
            data={slides_results}
            renderItem={RenderSlide}
            keyExtractor={(item) => item.image + item.id}
            //horizontal
            // ItemSeparatorComponent={Separator}
            //snapToInterval
            snapToAlignment="start"
            decelerationRate={0}
          />
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  };

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
        onPageSelected={(e) => {
          //currentPager = e.nativeEvent.position;
          handleVideoAudioChange(e.nativeEvent.position);
        }}
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
        <AudioSlides
          slides={slides}
          videoHeight={videoHeight}
          videostyle={videostyle}
          key="1"
        />
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
  setCurrSlide: (num: number) => dispatch(setCurrentSlide(num)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(VideoAudio);
