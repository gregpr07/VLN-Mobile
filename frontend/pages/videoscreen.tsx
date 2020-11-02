import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Constants from "expo-constants";

import { shorterText, numberWithCommas } from "../services/functions";

import { HeaderText } from "../components/TextHeader";

import { connect } from "react-redux";
import { setVideoID } from "../services/storage/actions";
import Container from "../components/Container";

import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";

import { useTheme } from "@react-navigation/native";

import { noHeadFetcher } from "../services/fetcher";

const padding = 14;
const VideosScreen = ({ navigation, setVidID, videoRef, audioRef }: any) => {
  const { colors, dark } = useTheme();

  const [latestLectures, setLatestLectures] = useState([]);
  const [mostStarred, setMostStarred] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);

  useEffect(() => {
    noHeadFetcher("lecture/latest/?limit=25").then((json) =>
      setLatestLectures(json.results)
    );
    noHeadFetcher("lecture/most_starred/?limit=25").then((json) =>
      setMostStarred(json.results)
    );
    noHeadFetcher("lecture/most_viewed/?limit=25").then((json) =>
      setMostViewed(json.results)
    );
  }, []);

  const _handleResultsClick = async (item) => {
    if (videoRef) {
      await videoRef.unloadAsync();
      await audioRef.unloadAsync();
    }

    setVidID(item.id);
    navigation.navigate("Player", {
      screen: "Video",
    });
  };

  const Videos = ({ videos, section }: any) => {
    const VID_HEIGHT = 90;
    const VID_WIDTH = 200;

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

    const RenderVideo = ({ item, index }: any) => (
      <View
        style={{
          width: VID_WIDTH,
          borderRadius: 8,
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowRadius: 19,
          shadowOpacity: 1,

          marginTop: 10,
          marginBottom: padding,
        }}
      >
        <TouchableOpacity onPress={() => _handleResultsClick(item)}>
          <>
            <Image
              source={{
                uri: item.thumbnail,
              }}
              style={{
                width: "100%",
                height: VID_HEIGHT,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                resizeMode: "cover",
                //marginBottom: 5,
              }}
            />
            <View style={{ padding: 10 }}>
              <Text style={[styles.h4, { height: 36 }]}>
                {shorterText(item.title, 60)}
              </Text>

              <View>
                <Text style={[styles.h5, { color: colors.secondary }]}>
                  {item.author.name}
                  <Separator />
                  {numberWithCommas(item.views)}
                </Text>
              </View>
            </View>
          </>
        </TouchableOpacity>
      </View>
    );

    return (
      <View>
        <View style={{ flexDirection: "row", paddingHorizontal: padding }}>
          <Text style={[styles.h2, { flex: 1, color: colors.text }]}>
            {section}
          </Text>
          {/* <Text style={[styles.h2, { color: colors.secondary }]}>Show all</Text> */}
        </View>

        <SafeAreaView>
          <FlatList
            data={videos}
            renderItem={RenderVideo}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => (
              <View style={{ marginLeft: padding }} />
            )}
            horizontal
            ListHeaderComponent={() => (
              <View style={{ paddingLeft: padding }} />
            )}
            snapToInterval={VID_WIDTH + padding}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
          />
        </SafeAreaView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
    h1: {
      fontSize: 36,
      fontFamily: "SF-UI-semibold",
      color: colors.text,
    },
    h2: {
      fontSize: 20,
      fontFamily: "SF-UI-semibold",
      color: colors.text,
    },
    h3: {
      fontSize: 14,
      fontFamily: "SF-UI-semibold",
      textAlign: "center",
      color: colors.text,
    },
    h4: {
      fontSize: 14,
      fontFamily: "SF-UI-medium",
      color: colors.text,
    },
    h5: {
      fontSize: 12,
      fontFamily: "SF-UI-medium",
      color: colors.text,
    },
  });

  return (
    <Container>
      <ScrollView style={styles.container}>
        <HeaderText text="Explore" />
        <Videos videos={latestLectures} section={"Latest lectures"} />
        <Videos videos={mostViewed} section={"Most viewed"} />
        <Videos videos={mostStarred} section={"Most starred"} />
      </ScrollView>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  videoID: state.video.videoID,
  videoRef: state.video.videoRef,
  audioRef: state.video.audioRef,
});

const mapDispatchToProps = (dispatch) => ({
  setVidID: (num: number) => dispatch(setVideoID(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosScreen);
