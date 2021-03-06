import React, { useState, useEffect, useRef } from "react";
import {
  View,
  // Pressable,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import { connect } from "react-redux";

import {
  shorterText,
  numberWithCommas,
  formatDate,
} from "../../services/functions";

import { setVideoID, setVideoRef } from "../../services/storage/actions";

import { API } from "../../services/fetcher";

const { width, height } = Dimensions.get("window");

import { useTheme } from "@react-navigation/native";

const RecommendedVids = ({
  videoRef,
  audioRef,
  styles,
  lecture,
  setVidID,
  videoID,
  padding,
}) => {
  const { colors, dark } = useTheme();

  const Separator = () => (
    <Text
      style={{
        color: colors.secondary,
      }}
    >
      {" "}
      |{" "}
    </Text>
  );

  const [recommendations, setRecommendations] = useState([]);

  const getRecommendation = (text) => {
    const search_link = `${API}search/lecture/${text}/0/`;
    fetch(search_link)
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((json) => {
        json
          ? setRecommendations(
              json.lectures.filter((item) =>
                item.id !== videoID ? item : null
              )
            )
          : setRecommendations([]);
      });
  };

  useEffect(() => {
    if (lecture.title) {
      const text =
        lecture.author.name + " " + lecture.title + " " + lecture.description;
      getRecommendation(text);
    }
  }, [lecture]);

  const handleAcceptRecc = async (id: number) => {
    try {
      await videoRef.unloadAsync();
      await audioRef.unloadAsync();

      setVidID(id);
    } catch (e) {
      console.log("cant accept");
    }
  };

  return (
    <View style={[styles.default_card, styles.marginBottom]}>
      <Text
        style={[
          styles.h3,
          { paddingBottom: recommendations.length ? padding : 0 },
        ]}
      >
        Related videos
      </Text>
      {recommendations.map(
        (
          recc: {
            author: string;
            id: number;
            thumbnail: string;
            title: string;
            views: number;
            published: string;
          },
          index: number
        ) => (
          <TouchableOpacity
            onPress={() => handleAcceptRecc(recc.id)}
            key={recc.id}
            style={{
              paddingTop: index ? 8 : 0,
              paddingBottom: index !== recommendations.length - 1 ? 8 : 0,
              flexDirection: "row",
            }}
          >
            <Image
              source={
                recc.thumbnail
                  ? {
                      uri: recc.thumbnail,
                    }
                  : require("../../assets/icons/video-thumbnail.png")
              }
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
                {shorterText(recc.title, width / 6)}
              </Text>
              <View>
                <Text style={[styles.h5, { color: colors.secondary }]}>
                  {/* {recc.views}
                      <Separator /> */}
                  {recc.author}
                  <Separator />
                  {numberWithCommas(recc.views)}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "SF-UI-semibold",
                    paddingTop: 2,
                    color: colors.secondary,
                  }}
                >
                  {formatDate(recc.published)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      )}
    </View>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendedVids);
