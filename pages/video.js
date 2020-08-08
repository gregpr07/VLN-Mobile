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
} from "react-native";

// functions
import { YoutubeTime } from "../functions/functions/";

// expo
import Constants from "expo-constants";
import { Video } from "expo-av";

// dimensions
const { width, height } = Dimensions.get("window");

var videoRef;

export default function VideoScreen({ route, navigation }) {
  const { videoId } = route.params;
  console.log(videoId);
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

  const notes = [
    {
      text: "is this really what he meant?",
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
  ];

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
    /*     {
      title: "",
      views: 1,
      author: "",
      date: "",
      image: "",
    }, */
  ];

  const Notes = () => (
    <View>
      <Text style={styles.h3}>Your notes</Text>
      <View style={styles.your_notes}>
        {notes.map((note) => (
          <View key={note.text} style={styles.single_note}>
            <Button
              onPress={() => handleTimestamp(note.timestamp)}
              title={YoutubeTime(note.timestamp)}
            />
            {/* <Image source={timestamp} style={{ height: 20, width: 20 }} /> */}

            <Text style={styles.note_text}>{note.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
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
    <ScrollView style={styles.container}>
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
          shouldPlay={true}
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
    paddingTop: Constants.statusBarHeight,
    padding: padding,
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
    paddingVertical: 8,
    //height: 100,
    marginVertical: 16,
    backgroundColor: "#EB575725",
  },
  single_note: {
    paddingVertical: 6,
    /* borderBottomColor: "#4F4F4F25",
    borderBottomWidth: 1, */
  },
  note_text: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
    color: "#4F4F4F",
  },
});
