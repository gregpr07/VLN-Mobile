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
  // Pressable,
  Animated,
} from "react-native";

import Constants from "expo-constants";

// @ts-ignore
import Slideshow from "react-native-image-slider-show";

// functions
import { YoutubeTime, shorterText, compare } from "../services/functions";

// expo
import { Video, Audio } from "expo-av";
import ViewPager from "@react-native-community/viewpager";

// dimensions
const { width, height } = Dimensions.get("window");

const videoHeight = (width / 16) * 9;

//TODO BUGS
// - when going to audio and opening notes the continuity breakes

export default function VideoScreen({ route, navigation }: any) {
  //* constants
  const initPager = 0;
  let currentPager = initPager;

  //* VIDEO AND AUDIO REFERENCES
  var videoRef: any;
  const audioRef = new Audio.Sound();

  //const [stateVideoRef, setStateVideoRef] = useState();
  const { videoId, title, video_url } = route.params;

  //? using let because we don't want the screen to re-render because of video
  let currentPositionMillis: number;
  let videoIsLoaded: boolean;

  useEffect(() => {
    let shouldUpdate = true;
    navigation.addListener("state", async () => {
      if (videoRef && shouldUpdate) {
        shouldUpdate = false;
        //! THIS IS WHERE TO IMPLEMENT MEMORY OF CURRENT TIME
        currentPositionMillis = 0;
        playVideoORAudio(initPager).then(() => (shouldUpdate = true));
      }
    });
  }, [route.params]);

  // currently 0 is video 1 is audio but this might change
  async function playVideoORAudio(page: number) {
    currentPager = page;
    const initStatus = {
      shouldPlay: true,
      positionMillis: currentPositionMillis,
    };

    if (page === 0) {
      audioRef.unloadAsync();
      const load = await videoRef.loadAsync(
        video_url,
        (initialStatus = initStatus)
      );

      return load;
    }
    if (page === 1) {
      videoRef.unloadAsync();
      const loadAudio = audioRef.loadAsync(
        {
          uri:
            "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3",
        },
        (initialStatus = initStatus)
      );
      return loadAudio;
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

  const video_stats = {
    title: title,
    url: "http://hydro.ijs.si/v00e/0c/bqsbpqtnh52xm5nnm2iidqmf5vccd4l2.mp4",
    poster: "http://hydro.ijs.si/v013/2a/fil6y2o3eazawewmlpi4gg4osoodvfbz.jpg",
    views: 1498,
    author: "Oliver Downs",
    published: "Sept. 5, 2016",
  };

  const AudioSlides = () => {
    const slides = [
      {
        timestamp: 1000,
        url: "http://hydro.ijs.si/v017/d0/2d4vgnj6yhkmc4lizj7dwj3frapczcj7.jpg",
      },
      {
        timestamp: 3000,
        url: "http://hydro.ijs.si/v017/4c/jq3hmgmb256bmcflmegdx4lrev4ynn7l.jpg",
      },
      {
        timestamp: 10000,
        url: "http://hydro.ijs.si/v017/c4/yrtcai7uxrpz6bglzu5qepi3regifjwf.jpg",
      },
    ];
    //const slidesarray = slides.map((slide) => slide.url);

    const getCurrentSlide = () => {
      const newslides = slides
        .sort(compare)
        .filter((slide) => slide.timestamp < currentPositionMillis);
      return newslides.length;
    };
    const [slidePosition, setSlidePosition] = useState(getCurrentSlide());

    //! this is very slow - must fix it!!!
    const handleSlideChange = () => {
      setSlidePosition(getCurrentSlide());
      //console.log(newslides.length);
    };

    let intervalid = setInterval(handleSlideChange, 1000);

    return (
      /*       <Image
        source={{
          uri: slidesarray[slidePosition],
        }}
        style={styles.video}
        blurRadius={10}
      /> */
      <Slideshow
        dataSource={slides}
        position={slidePosition}
        style={styles.video}
        scrollEnabled={false}
        arrowSize={0}
        height={videoHeight}
      />
    );
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

    const [notes, setNotes] = useState([
      {
        text:
          "Screens support is built into react-navigation starting from version 2.14.0 for all the different navigator types (stack, tab, drawer, etc). We plan on adding it to other navigators shortly. To configure react-navigation to use screens instead of plain RN Views for rendering screen views, follow the steps below:",
        timestamp: 12312,
      },
      {
        text: "This is how we do it?",
        timestamp: 26312,
      },
      {
        text: "Why does it matter?",
        timestamp: 626312,
      },
      {
        text: "Why does it matterrrr?",
        timestamp: 6626312,
      },
    ]);

    const RenderNote = ({ item, index }: any) => {
      return (
        <View
          style={{
            paddingVertical: 6,
          }}
        >
          <Button
            onPress={() => handleTimestamp(item.timestamp)}
            title={YoutubeTime(item.timestamp)}
          />

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
        <View style={{}} /* keyboardShouldPersistTaps="handled" */>
          <View style={{}}>
            <TextInput
              style={{
                marginBottom: 10,
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
            {noteText ? (
              <TouchableHighlight
                style={{
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: "#5DB075",
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
        <Text style={[styles.h4, { color: "gray", marginVertical: 20 }]}>
          Swipe down to dismiss the notes
        </Text>
      </View>
    );

    const handleQuit = (props: any) => {
      const offset = 75;
      const currentY = props.nativeEvent.contentOffset.y;
      // || currentX > ITEM_SIZE + SEPARATOR_SIZE
      // ALSO NEED TO IMPLEMENT RIGHT SIDE
      if (currentY < -offset) {
        //console.log(videoStatus);
        /* 
        }); */
        setShowNotes(false);
        SpringIn();
        FadeIn();
      }
    };

    //videoRef

    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: padding / 2,
        }}
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
    <View style={styles.description}>
      <Text style={styles.h4}>
        <Text style={styles.gray}>views:</Text> {video_stats.views}
      </Text>
      <Text style={styles.h4}>
        <Text style={styles.gray}>author:</Text> {video_stats.author}
      </Text>
      <Text style={styles.h4}>
        <Text style={styles.gray}>published:</Text> {video_stats.published}
      </Text>
    </View>
  );

  const Separator = () => (
    <Text
      style={{
        color: "#6FCF97",
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
      <View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 20,
            backgroundColor: "#5DB075",
          }}
          onPress={handleSwitch}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: "SF-UI-medium",
              color: "white",
              textAlign: "center",
            }}
          >
            Show Notes
          </Text>
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
          <Text style={styles.video_title}>{video_stats.title}</Text>
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
          onPageSelected={(e) => playVideoORAudio(e.nativeEvent.position)}
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
                uri: video_stats.poster,
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

            <SwitchToNotes />
          </Animated.View>

          {/* recommendations */}

          <View style={{ marginTop: 8, flex: 1 }}>
            <Text style={styles.h4}>Recommended videos {videoId}</Text>
            {recommendations.map((recc) => (
              <TouchableOpacity
                onPress={() => handleAcceptRecc(recc)}
                key={recc.title}
                style={styles.recommendation}
              >
                <Image
                  source={{ uri: recc.image }}
                  style={{
                    height: 80,
                    maxWidth: (80 / 9) * 16,
                    flex: 2,
                    borderRadius: 12,
                    resizeMode: "cover",
                  }}
                />
                <View
                  style={{
                    flex: 3,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.h5}>{shorterText(recc.title, 60)}</Text>
                  <View style={styles.description}>
                    <Text style={[styles.h5, { color: "#828282" }]}>
                      {recc.views}
                      <Separator />
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
    </View>
  );
}

const padding = 12;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: padding,
    paddingTop: padding + Constants.statusBarHeight,
    backgroundColor: "white",
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

    fontFamily: "SF-UI-medium",
    paddingRight: 32,
  },
  video: {
    //borderRadius: 32,
    height: videoHeight, //- 2 * padding
    width: width, // - 2 * padding,
  },
  description: {
    paddingVertical: 8,
  },
  recommendation: {
    paddingVertical: 8,
    flexDirection: "row",
  },
  your_notes: {
    borderRadius: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "white",
  },
  note_text: {
    fontFamily: "SF-UI-light",
    fontSize: 16,
    color: "#4F4F4F",
  },
});
