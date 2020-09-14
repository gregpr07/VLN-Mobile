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
import { YoutubeTime, shorterText } from "../services/functions";

// expo
import { Video } from "expo-av";
import ViewPager from "@react-native-community/viewpager";

// dimensions
const { width, height } = Dimensions.get("window");

export default function VideoScreen({ route, navigation }: any) {
  var videoRef: any;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => {
            videoRef.unloadAsync();
            navigation.navigate("Videos");
          }}
          title="Videos"
        />
      ),
    });
  }, [navigation]);

  //const [stateVideoRef, setStateVideoRef] = useState();
  const { videoId, title, url } = route.params;

  //console.log(videoId);
  const _handleVideoRef = (component: any) => {
    if (!videoRef) {
      videoRef = component;
      //setStateVideoRef(component);
      //console.log(component);
      //videoreference = component;
    }
  };

  async function get_vid_status(ret_obj: any) {
    if (videoRef) {
      const AVPlaybackStatus = await videoRef.getStatusAsync();
      //setVideoStatus(AVPlaybackStatus);
      return AVPlaybackStatus[ret_obj];
    }
  }

  /* // HANDLE FULLSCREEN ON ROTATION
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
  }, [orientation]); */
  // /
  /*   useEffect(() => {
    navigation.addListener("willFocus", async () => {
      videoRef.stopAsync();
    });
  }, [navigation]); */

  const handleTimestamp = (timestamp: number) => {
    videoRef.setPositionAsync(timestamp);
    console.log(videoRef);
  };

  const video_stats = {
    title: title,
    url: "http://hydro.ijs.si/v00e/0c/bqsbpqtnh52xm5nnm2iidqmf5vccd4l2.mp4",
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
    {
      text: "Why does it matterrrr?",
      timestamp: 6626312,
    },
  ]);

  const Notes = () => {
    const ITEM_SIZE = 200;
    const SEPARATOR_SIZE = 10;

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
      const handleChangeText = (text: string) => {
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
        <View style={{}} /* keyboardShouldPersistTaps="handled" */>
          <View style={{}}>
            <TextInput
              style={{
                marginVertical: 10,
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

    const handleQuit = (props: any) => {
      const offset = 100;
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
          initialPage={0}
          style={{
            height: ((width - 2 * padding) / 16) * 9,
          }}
          pageMargin={100}
          //transitionStyle="curl"
        >
          <View key="1">
            <Video
              ref={(component) => _handleVideoRef(component)}
              source={{
                uri: video_stats.url,
              }}
              posterSource={{
                uri: video_stats.poster,
              }}
              resizeMode={Video.RESIZE_MODE_COVER}
              usePoster={true}
              shouldPlay={true}
              //isLooping={false}
              style={styles.video}
              useNativeControls={true}
            />
          </View>
          <Image
            key="2"
            source={{
              uri: video_stats.poster,
            }}
            style={styles.video}
            blurRadius={10}
          ></Image>
        </ViewPager>
      </Animated.View>

      {showNotes ? (
        <Notes />
      ) : (
        <>
          <Animated.View>
            <Description />

            <SwitchToNotes />
          </Animated.View>

          {/* recommendations */}

          <View style={{ marginTop: 8, flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
    backgroundColor: "white",
    paddingBottom: 0,
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
