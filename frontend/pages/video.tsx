import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableHighlight,
  TextInput,
  Keyboard,
  ActivityIndicator,
  // Pressable,
  Animated,
} from "react-native";

import Constants from "expo-constants";

import { Ionicons } from "@expo/vector-icons";

// @ts-ignore
import Slideshow from "react-native-image-slider-show";

// functions
import { YoutubeTime, shorterText, compare } from "../services/functions";

import { fetcher } from "../services/fetcher";

// expo
import { Video, Audio } from "expo-av";
import ViewPager from "@react-native-community/viewpager";

// fetching
import useSWR from "swr";

// dimensions
const { width, height } = Dimensions.get("window");

const videoHeight = (width / 16) * 9;

//? using let because we don't want the screen to re-render because of video
let currentPositionMillis: number;
let videoIsLoaded: boolean;
let videoplaying: boolean;
let audioplaying: boolean;

const initPager = 1;
let currentPager = initPager;

var videoRef: any;
const audioRef = new Audio.Sound();

//TODO BUGS
// - when going to audio and opening notes the continuity breakes

export default function VideoScreen({ route, navigation }: any) {
  const { data: lecture, error } = useSWR("lecture/1", fetcher);
  const { data: notes } = useSWR("note", fetcher);
  const { data: slides } = useSWR("slide", fetcher);

  //* constants

  //* VIDEO AND AUDIO REFERENCES

  //const [stateVideoRef, setStateVideoRef] = useState();
  const { videoId, title, video_url } = route.params;

  //const [testState, setTeststate] = useState(0);

  //! SELF DEBUGGER - NOT GOOD
  if (videoplaying && audioplaying) {
    resetState(currentPositionMillis);
  }
  //!

  async function resetState(position: number) {
    await videoRef.unloadAsync();
    await audioRef.unloadAsync();

    videoplaying = false;
    audioplaying = false;

    currentPositionMillis = position;

    playVideoORAudio(currentPager).then(() => (shouldUpdate = true));
    return true;
  }

  useEffect(() => {
    if (lecture) {
      let shouldUpdate = true;
      navigation.addListener("state", async () => {
        if (videoRef && shouldUpdate) {
          shouldUpdate = false;

          resetState(0);
        }
      });
    }
  }, [route.params]);

  // currently 0 is video 1 is audio but this might change
  async function playVideoORAudio(page: number) {
    console.log("page is" + currentPager);

    const initStatus = {
      shouldPlay: true,
      positionMillis: currentPositionMillis,
    };
    console.log(videoplaying, audioplaying);

    if (page === 0) {
      if (audioplaying) {
        await audioRef.unloadAsync();
        audioplaying = false;
      }
      if (!videoplaying) {
        const load = await videoRef.loadAsync(
          {
            uri: lecture.video,
          },
          (initialStatus = initStatus)
        );
        videoplaying = true;
      }

      return null;
    }
    if (page === 1) {
      if (videoplaying) {
        await videoRef.unloadAsync();
        videoplaying = false;
      }
      if (!audioplaying) {
        const loadAudio = audioRef.loadAsync(
          {
            uri: lecture.audio,
          },
          (initialStatus = initStatus)
        );
        audioplaying = true;
      }
      return null;
    }
  }

  // this is set when dealing with video
  const onPlaybackStatusUpdate = (status: any) => {
    //console.log(status.positionMillis);
    currentPositionMillis = status.positionMillis;
    videoIsLoaded = status.isLoaded;
    console.log(currentPositionMillis);

    //! change timestamp
    //handleSlideChange();
  };

  //console.log(videoId);
  const _handleVideoRef = (component: any) => {
    if (!videoRef) {
      videoRef = component;
      videoRef.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      audioRef.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  };

  // HANDLE FULLSCREEN ON ROTATION
  const isPortrait = () => {
    const dim = Dimensions.get("screen");
    return dim.height >= dim.width;
  };
  const [orientation, setOrientation] = useState(isPortrait());
  Dimensions.addEventListener("change", () => {
    if (isPortrait() !== orientation) {
      setOrientation(isPortrait());
    }
  });
  useEffect(() => {
    console.log("orientation changed to " + isPortrait());
    console.log(videoIsLoaded);
    if (videoIsLoaded) {
      if (isPortrait()) {
        videoRef.dismissFullscreenPlayer();
      } else {
        videoRef.presentFullscreenPlayer();
      }
    }
  }, [orientation]);

  const handleTimestamp = (timestamp: number) => {
    if (currentPager === 0) {
      videoRef.setPositionAsync(timestamp);
    }
    if (currentPager === 1) {
      audioRef.setPositionAsync(timestamp);
    }
    //console.log(videoRef);
  };

  const AudioSlides = () => {
    //const slidesarray = slides.map((slide) => slide.url);
    const [slidePosition, setSlidePosition] = useState(0);

    const getCurrentSlide = () => {
      const newslides = slides
        ? slides
            .sort(compare)
            .filter((slide) => slide.timestamp < currentPositionMillis)
        : [];
      return newslides.length - 1;
    };

    //? this is very slow
    const handleSlideChange = () => {
      if (audioplaying) {
        setSlidePosition(getCurrentSlide());
        //console.log(newslides.length);
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

      return (
        //! write this by hand
        <TouchableHighlight onPress={handlePausePlay}>
          <Slideshow
            //! SLIDESHOW REQUIRES NAME URL, CURRENTLY IS IMAGE
            dataSource={slides}
            position={slidePosition}
            style={styles.video}
            scrollEnabled={false}
            arrowSize={0}
            height={videoHeight}
          />
        </TouchableHighlight>
      );
    } else return null;
  };

  const recommendations = [
    {
      title:
        "This page - How Machine Learning has Finally Solved Wanamaker’s Dilemma",
      views: 12784,
      author: "Oliver Downs",
      date: "2016",
      image: "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
    },
    {
      title: "This page - How Machine ",
      views: 127123,
      author: "Oliver Downs",
      date: "2016",
      image: "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
    },
    {
      title: "Blabla video title ",
      views: 27312391,
      author: "Erik Novak",
      date: "201123",
      image: "http://hydro.ijs.si/v013/d2/2ley3qjmm7a3v7g6lnq5duermqrzbq7f.jpg",
    },
  ];

  const [showNotes, setShowNotes] = useState(false);

  const Notes = () => {
    const ITEM_SIZE = 200;
    const SEPARATOR_SIZE = 10;

    //const [notes, setNotes] = useState([]);

    const RenderNote = ({ item, index }: any) => {
      return (
        <View
          style={{
            paddingVertical: 6,
          }}
        >
          <TouchableHighlight onPress={() => handleTimestamp(item.timestamp)}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text>{YoutubeTime(item.timestamp)}</Text>
              <Ionicons
                name={"ios-play-circle"}
                size={16}
                //color={"black"}
                style={{ marginLeft: 5 }}
              />
            </View>
          </TouchableHighlight>

          <Text style={styles.note_text}>{item.text}</Text>
        </View>
      );
    };

    const Separator = () => (
      <View
        style={{
          //marginHorizontal: SEPARATOR_SIZE,
          borderColor: "#E8E8E8",
          borderWidth: 0.5,
        }}
      ></View>
    );

    const NoteHeader = () => {
      const [noteText, setNoteText] = useState("");
      const [timestamp, setTimestamp] = useState(0);
      const output_obj = {
        text: noteText,
        timestamp: timestamp,
      };
      const handleChangeText = (text: string) => {
        setNoteText(text);
        if (text.length === 1 && currentPositionMillis) {
          setTimestamp(currentPositionMillis);
          console.log(currentPositionMillis);
        }
      };
      const handleNoteSubmit = () => {
        if (noteText) {
          let newnotes = [...notes, output_obj].sort(compare);
          setNotes(newnotes);
        }
        Keyboard.dismiss();
        setNoteText("");
        console.log(output_obj);
      };
      return (
        <View
        /* keyboardShouldPersistTaps="handled" */
        >
          <View style={{}}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TextInput
                style={{
                  marginBottom: 10,

                  paddingBottom: 5,
                  flex: 9,
                }}
                onChangeText={handleChangeText}
                value={noteText}
                autoFocus={true}
                //onSubmitEditing={handleSubmit}
                clearButtonMode={"always"}
                multiline
                placeholder={"Add new note here"}
                placeholderTextColor="#BDBDBD"
              />
              <TouchableOpacity onPress={() => quitNotes()}>
                <Ionicons name={"ios-close"} size={30} color={"black"} />
              </TouchableOpacity>
            </View>
            {noteText ? (
              <TouchableHighlight
                style={{
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: "#5468fe",
                }}
                onPress={handleNoteSubmit}
                accessible={false}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "SF-UI-medium",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Create note
                </Text>
              </TouchableHighlight>
            ) : null}
          </View>
        </View>
      );
    };
    const EmptyComponent = () => (
      <View
        style={{
          paddingVertical: 12,
        }}
      >
        <Text
          style={[
            styles.h4,
            { color: "gray", marginVertical: 20, textAlign: "center" },
          ]}
        >
          Swipe down to dismiss the notes
        </Text>
      </View>
    );

    const quitNotes = () => {
      setShowNotes(false);
      SpringIn();
      FadeIn();
    };
    const handleQuit = (props: any) => {
      const offset = 75;
      const currentY = props.nativeEvent.contentOffset.y;
      // || currentX > ITEM_SIZE + SEPARATOR_SIZE
      // ALSO NEED TO IMPLEMENT RIGHT SIDE
      if (currentY < -offset) {
        quitNotes();
      }
    };

    //videoRef

    return (
      <View
        style={[
          styles.default_card,
          {
            margin: padding,
          },
        ]}
      >
        <SafeAreaView style={styles.your_notes}>
          <FlatList
            data={notes}
            renderItem={RenderNote}
            keyExtractor={(item) => item.text}
            //horizontal
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={NoteHeader}
            ListEmptyComponent={EmptyComponent}
            //snapToInterval
            snapToAlignment="start"
            decelerationRate={0}
            showsVerticalScrollIndicator={false}
            onScroll={handleQuit}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </SafeAreaView>
      </View>
    );
  };

  const Description = () => (
    <View style={styles.default_card}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View>
          <Image
            source={{ uri: "https://platform.x5gon.org/imgs/team/john.jpg" }}
            style={{
              height: 60,
              width: 60,
              borderRadius: 50,
              borderColor: "white",
              borderWidth: 5,
              marginRight: 15,
            }}
          />
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.h5}>
            <Text style={styles.gray}>views:</Text> {lecture.views}
          </Text>
          <Text style={styles.h5}>
            <Text style={styles.gray}>author:</Text> {lecture.author}
          </Text>
          <Text style={styles.h5}>
            <Text style={styles.gray}>published:</Text> {lecture.published}
          </Text>
        </View>
      </View>
    </View>
  );

  const Separator = () => (
    <Text
      style={{
        color: "#5468fe",
      }}
    >
      {" "}
      |{" "}
    </Text>
  );

  // when press it switches to notes, on long press it goes to add new note screen
  const SwitchToNotes = () => {
    const handleSwitch = () => {
      setShowNotes(true);
      SpringOut();
    };

    return (
      <View
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          margin: padding,
          //justifyContent: "center",
          //alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: "#5468fe",
          }}
          onPress={handleSwitch}
        >
          <Ionicons name={"ios-create"} size={30} color={"white"} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleAcceptRecc = (recc: { views: number; title: string }) => {
    //console.log(videoRef);
    //videoRef.stopAsync();
    navigation.setParams({
      videoID: recc.views,
      title: recc.title,
    });
  };

  // ANIMATIONS

  const [titleHeight, setTitlteHeight] = useState(0);

  const SpringAnim = useRef(new Animated.Value(0)).current;
  const OpacityAnim = useRef(new Animated.Value(1)).current;

  const SPRING_VAL = titleHeight;
  const SpringIn = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    SpringAnim.setValue(-SPRING_VAL);
    Animated.spring(SpringAnim, {
      toValue: 0,
      //duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const SpringOut = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    SpringAnim.setValue(SPRING_VAL);
    Animated.spring(SpringAnim, {
      toValue: 0,
      //duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const FadeIn = () => {
    OpacityAnim.setValue(0);
    Animated.spring(OpacityAnim, {
      toValue: 1,
      //duration: 400,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container} /* showsVerticalScrollIndicator={false} */>
      {/*       <Button
        onPress={() => setTeststate(testState + 1)}
        title={testState.toString()}
      /> */}
      {lecture ? (
        <>
          {showNotes ? null : (
            <Animated.View
              onLayout={(event) => {
                setTitlteHeight(event.nativeEvent.layout.height);
              }}
              style={{
                opacity: OpacityAnim,
                paddingHorizontal: padding,
              }}
            >
              <Text style={styles.video_title}>{lecture.title}</Text>
            </Animated.View>
          )}
          {/* VideoAudio */}
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
                currentPager = e.nativeEvent.position;
                playVideoORAudio(e.nativeEvent.position);
              }}
              //transitionStyle="curl"
              //showPageIndicator={true}
            >
              <View key="0">
                <Video
                  ref={(component) => _handleVideoRef(component)}
                  /*               source={{
                uri: video_stats.url,
              }} */
                  posterSource={{
                    uri: lecture.poster,
                  }}
                  resizeMode={Video.RESIZE_MODE_COVER}
                  usePoster={true}
                  //shouldPlay={true}
                  //isLooping={false}
                  style={styles.video}
                  useNativeControls={true}
                />
              </View>
              <AudioSlides key="1" />
            </ViewPager>
          </Animated.View>

          {showNotes ? (
            <Notes />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ paddingHorizontal: padding }}
            >
              <Animated.View>
                <Description />
              </Animated.View>

              {/* recommendations */}

              <View style={styles.default_card}>
                <Text style={styles.h3}>Related videos</Text>
                {recommendations.map((recc) => (
                  <TouchableOpacity
                    onPress={() => handleAcceptRecc(recc)}
                    key={recc.title}
                    style={styles.recommendation}
                  >
                    <Image
                      source={{ uri: recc.image }}
                      style={{
                        height: 60,
                        maxWidth: (60 / 9) * 16,
                        flex: 2,
                        borderRadius: 8,
                        resizeMode: "cover",
                      }}
                    />
                    <View
                      style={{
                        flex: 3,
                        paddingHorizontal: 10,
                        //justifyContent: "center",
                      }}
                    >
                      <Text style={styles.h5}>
                        {shorterText(recc.title, 50)}
                      </Text>
                      <View>
                        <Text style={[styles.h5, { color: "#828282" }]}>
                          {/* {recc.views}
                      <Separator /> */}
                          {recc.author}
                          <Separator />
                          {recc.date}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {showNotes ? null : <SwitchToNotes />}
        </>
      ) : (
        <ActivityIndicator
          //? 15 is for centering - very hacky!!
          style={{
            left: width / 2 - 15,
            top: height / 2,
            position: "absolute",
          }}
          size="small"
        />
      )}
    </View>
  );
}

const padding = 12;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: padding,
    paddingTop: Constants.statusBarHeight,
    //backgroundColor: "white",
    paddingBottom: 0,
  },
  h1: {
    fontSize: 36,
    textAlign: "center",
    fontFamily: "SF-UI-semibold",
  },

  h3: {
    fontSize: 20,
    fontFamily: "SF-UI-medium",
  },
  h4: {
    fontSize: 16,
    fontFamily: "SF-UI-medium",
  },
  h5: {
    fontSize: 14,
    fontFamily: "SF-UI-medium",
  },

  gray: {
    color: "#828282",
  },
  video_title: {
    fontSize: 18,
    paddingBottom: 8,

    fontFamily: "SF-UI-light",
    paddingRight: 32,
  },
  video: {
    //borderRadius: 32,
    height: videoHeight, //- 2 * padding
    width: width, // - 2 * padding,
  },

  recommendation: {
    paddingVertical: 8,
    flexDirection: "row",
  },
  your_notes: {
    paddingHorizontal: 8,
    marginVertical: 8,
    //backgroundColor: "white",
  },
  note_text: {
    fontFamily: "SF-UI-light",
    fontSize: 16,
    color: "#4F4F4F",
  },
  default_card: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    marginTop: padding,
    backgroundColor: "white",
    padding: padding,
    borderRadius: 12,
  },
});
