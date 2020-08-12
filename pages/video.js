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

// functions
import { YoutubeTime, shorterText } from "../functions/functions/";

// expo
import { Video } from "expo-av";

// dimensions
const { width, height } = Dimensions.get("window");

var videoRef;

export default function VideoScreen({ route, navigation }) {
  const { videoId, title } = route.params;

  //console.log(route);

  //console.log(videoId);
  const _handleVideoRef = (component) => {
    videoRef = component;
  };

  async function get_vid_status(ret_obj) {
    if (videoRef) {
      const AVPlaybackStatus = await videoRef.getStatusAsync();
      //setVideoStatus(AVPlaybackStatus);
      return AVPlaybackStatus[ret_obj];
    }
  }

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
    if (videoRef) {
      if (isPortrait()) {
        videoRef.dismissFullscreenPlayer();
      } else {
        videoRef.presentFullscreenPlayer();
      }
    }
  }, [orientation]);
  // /

  const handleTimestamp = (timestamp) => {
    videoRef.setPositionAsync(timestamp);
  };

  const video_stats = {
    title: "How Machine Learning has Finally Solved Wanamaker’s Dilemma",
    url: "http://hydro.ijs.si/v013/b6/wylr5jibhu2qtvpio2mdflqcby7oym6r.mp4",
    poster: "http://hydro.ijs.si/v013/2a/fil6y2o3eazawewmlpi4gg4osoodvfbz.jpg",
    views: 1498,
    author: "Oliver Downs",
    published: "Sept. 5, 2016",
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
  ]);

  const Notes = () => {
    const ITEM_SIZE = 200;
    const SEPARATOR_SIZE = 10;

    const RenderNote = ({ item, index }) => {
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
          marginHorizontal: SEPARATOR_SIZE,
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
      const handleChangeText = (text) => {
        setNoteText(text);
        if (text.length === 1) {
          get_vid_status("positionMillis").then((timestamp) => {
            setTimestamp(timestamp);
            console.log(timestamp);
          });
        }
      };
      const handleNoteSubmit = () => {
        if (noteText) {
          setNotes([...notes, output_obj]);
        }
        Keyboard.dismiss();
        setNoteText("");
        console.log(output_obj);
      };
      return (
        <View style={{}} keyboardShouldPersistTaps="handled">
          <View style={{}}>
            <TextInput
              style={{
                marginVertical: 10,
              }}
              onChangeText={handleChangeText}
              value={noteText}
              autoFocus={true}
              //onSubmitEditing={handleSubmit}
              clearButtonMode={"while-editing"}
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
                    fontFamily: "Inter_500Medium",
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
          Swipe left to create a note
        </Text>
      </View>
    );

    const handleQuit = (props) => {
      const offset = 100;
      const currentY = props.nativeEvent.contentOffset.y;
      // || currentX > ITEM_SIZE + SEPARATOR_SIZE
      // ALSO NEED TO IMPLEMENT RIGHT SIDE
      if (currentY < -offset) {
        //console.log(videoStatus);
        /* 
        }); */
        setShowNotes(false);
        fadeIn();
        SpringIn();
      }
    };

    //videoRef

    return (
      <View
        style={{
          flex: 1,
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
            snapToInterval
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
              fontFamily: "Inter_500Medium",
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

  // ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const SpingAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  const SpringIn = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    Animated.spring(SpingAnim, {
      toValue: 50,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const SpringOut = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    Animated.spring(SpingAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Video */}
      {showNotes ? null : (
        <Animated.View
          style={{
            opacity: fadeAnim, // Bind opacity to animated value
          }}
        >
          <Text style={styles.video_title}>{video_stats.title}</Text>
        </Animated.View>
      )}

      <Animated.View style={{ transform: [{ translateY: SpingAnim }] }}>
        <Video
          source={{
            uri: video_stats.url,
          }}
          posterSource={{
            uri: video_stats.poster,
          }}
          resizeMode={Video.RESIZE_MODE_COVER}
          usePoster={true}
          shouldPlay={false}
          //isLooping={false}
          style={styles.video}
          useNativeControls={true}
          ref={_handleVideoRef}
        />
      </Animated.View>

      {showNotes ? (
        <Notes />
      ) : (
        <>
          <Description />

          <SwitchToNotes />

          {/* recommendations */}

          <View style={{ marginTop: 8, flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.h4}>Recommended videos {videoId}</Text>
              {recommendations.map((recc) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("Video", {
                      videoID: recc.views,
                      title: recc.title,
                    });
                    videoRef.stopAsync();
                  }}
                  key={recc.title}
                  style={styles.recommendation}
                >
                  <Image
                    source={{ uri: recc.image }}
                    style={{
                      height: 80,
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
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const padding = 12;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
    paddingTop: padding,
  },
  h1: {
    fontSize: 36,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
  },

  h3: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  h4: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  h5: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },

  gray: {
    color: "#828282",
  },
  video_title: {
    fontSize: 18,
    paddingBottom: 8,

    fontFamily: "Inter_500Medium",
    paddingRight: 32,
  },
  video: {
    borderRadius: 16,
    height: ((width - 2 * padding) / 16) * 9,
    width: width - 2 * padding,
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
    fontFamily: "Inter_300Light",
    fontSize: 16,
    color: "#4F4F4F",
  },
});
