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
  Image,
  Modal,
  Button,
} from "react-native";

import { connect } from "react-redux";

import ImageViewer from "react-native-image-zoom-viewer";

/* import ViewPager from "@react-native-community/viewpager"; */
import { Video } from "expo-av";

import OnlyVideo from "./OnlyVideo";

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

  const [currentSlideState, setCurrentSlideState] = useState(currentSlide);
  const [lightboxShown, setLightboxShown] = useState(false);

  const slidesRef = useRef(null);

  useEffect(() => {
    if (videoID && videoRef) {
      playVideoORAudio(videoAudioPlay, currentPositionMillis);
    }
    moveToCurrentSlide();
  }, [videoAudioPlay]);

  const getCurrentSlide = () => {
    if (slides) {
      const newslides = slides
        ? slides.results
            .sort(compare)
            .filter((slide) => slide.timestamp < currentPositionMillis)
        : [];
      if (!newslides.length) {
        return null;
      }
      if (slides.results.length >= newslides.length)
        return newslides.length - 1;
    }
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
      setCurrentSlideState(gotSlide);
    }
  };

  // this is set when dealing with video loop
  const onPlaybackStatusUpdate = (status: any) => {
    currentPositionMillis = status.positionMillis;

    moveToCurrentSlide();
  };

  const AudioSlides = () => {
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
        onLongPress={() => {
          handleSlidePress(index);
        }}
        onPress={() => {
          /* currentSlide = index; */
          setLightboxShown(true);
        }}
      >
        <Image
          source={{
            uri: item.image,
          }}
          style={{
            ...videostyle,
            backgroundColor: colors.background,
            resizeMode: "contain",
            zIndex: 1000,
          }}
        />
      </TouchableOpacity>
    );

    const SlidesFooter = ({ index }) => (
      <TouchableOpacity
        onPress={() => {
          setLightboxShown(false);
          handleSlidePress(index);
        }}
        style={{
          paddingBottom: 20,
          width: windowWidth,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 20,
            fontFamily: "SF-UI-medium",
            lineHeight: 20,
          }}
        >
          {index === currentSlideState
            ? "This is current slide"
            : "Go to this slide"}
        </Text>
      </TouchableOpacity>
    );

    const SlideHeader = () => (
      <TouchableOpacity
        onPress={() => setLightboxShown(false)}
        style={{ position: "absolute", paddingTop: 50 }}
      >
        <Text style={{ color: "white" }}>Exit</Text>
      </TouchableOpacity>
    );

    if (slides) {
      const slides_results = slides.results.map((res) => {
        return { url: res.image, id: res.id, title: res.title };
      });

      return (
        //! write this by hand

        <>
          <Modal visible={lightboxShown} transparent={true}>
            <ImageViewer
              imageUrls={slides_results}
              enableSwipeDown
              swipeDownThreshold={50}
              onCancel={() => setLightboxShown(false)}
              index={currentSlideState}
              //renderHeader={() => <SlideHeader />}
              footerContainerStyle={{
                position: "absolute",
                zIndex: 9999,
              }}
              useNativeDriver
              //backgroundColor={"#00000000"}
              renderFooter={(index) => <SlidesFooter index={index} />}
            />
          </Modal>
          <FlatList
            ref={slidesRef}
            data={slides.results}
            renderItem={RenderSlide}
            style={[
              /* videostyle, */
              (videoAudioPlay === 1 || showSlides) && slides.results
                ? null
                : { display: "none" },
              {
                backgroundColor: colors.background,
                zIndex: 1000,
              },
            ]}
            initialScrollIndex={currentSlide}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item) => item.image + item.id}
            onScrollToIndexFailed={(item) => console.log(item.index)}
            //pagingEnabled={true}
            scrollEnabled={false}
            snapToInterval={windowWidth}
          />
        </>
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
        <OnlyVideo onPlaybackStatusUpdate={onPlaybackStatusUpdate} />
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
