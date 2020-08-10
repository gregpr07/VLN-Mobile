import React, { useState, useEffect } from "react";
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
} from "react-native";

// functions
import { YoutubeTime } from "../functions/functions/";

// expo
import { Video } from "expo-av";

// dimensions
const { width, height } = Dimensions.get("window");

var videoRef;

export default function VideoScreen({ route, navigation }) {
  const { videoId } = route.params;
  //console.log(videoId);
  const _handleVideoRef = (component) => {
    videoRef = component;
  };

  /*   // HANDLE FULLSCREEN ON ROTATION
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
  // / */

  const handleTimestamp = (timestamp) => {
    videoRef.setPositionAsync(timestamp);
  };

  const video_stats = {
    title: "How Machine Learning has Finally Solved Wanamaker’s Dilemma",
    url: "http://hydro.ijs.si/v015/11/cgxg4dyngkssttt3g6odzj2fmxryb2c6.mp4",
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
  ];

  const Notes = () => {
    const notes = [
      /*       {
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
      }, */
    ];

    const ITEM_SIZE = 200;
    const SEPARATOR_SIZE = 10;
    const RenderNote = ({ item, index }) => {
      return (
        <View
          style={{
            paddingVertical: 6,
            width: ITEM_SIZE,
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
    const NoteHeader = () => null;
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

    const handleAddMore = (props) => {
      const offset = 50;
      const currentX = props.nativeEvent.contentOffset.x;
      // || currentX > ITEM_SIZE + SEPARATOR_SIZE
      // ALSO NEED TO IMPLEMENT RIGHT SIDE
      if (currentX < -offset) {
        navigation.navigate("NewNote");
        console.log(currentX);
      }
    };

    return (
      <View>
        <Text style={styles.h3}>Your notes</Text>

        <SafeAreaView style={styles.your_notes}>
          <FlatList
            data={notes}
            renderItem={RenderNote}
            keyExtractor={(item) => item.text}
            horizontal
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={NoteHeader}
            ListEmptyComponent={EmptyComponent}
            snapToInterval={ITEM_SIZE + 2 * SEPARATOR_SIZE}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            onScroll={handleAddMore}
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Video */}
      <View>
        <Text style={styles.video_title}>{video_stats.title}</Text>
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
        {/* <Button onPress={stopVideo} title="Pause"></Button> */}
        <Description />
      </View>
      <Notes />

      {/* recommendations */}

      <View>
        <Text style={styles.h3}>Recommended videos {videoId}</Text>

        <View style={{ marginTop: 8, marginBottom: 50 }}>
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
                  height: 90,
                  flex: 3,
                  borderRadius: 12,
                  resizeMode: "cover",
                }}
              />
              <View style={{ flex: 4, padding: 10, justifyContent: "center" }}>
                <Text style={styles.h5}>{recc.title}</Text>
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
      </View>
    </ScrollView>
  );
}

const padding = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
    paddingTop: 0,
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
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
  h5: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },

  gray: {
    color: "#828282",
  },
  video_title: {
    fontSize: 22,
    paddingBottom: 16,
    paddingTop: 16,
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
    //height: 100,
    marginVertical: 8,
    backgroundColor: "white",
  },
  note_text: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
    color: "#4F4F4F",
  },
  button_default: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "#5DB075",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
});
