import React, { useState, useEffect, useRef } from "react";
import {
  View,
  // Pressable,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import { connect } from "react-redux";

import { shorterText } from "../../services/functions";

import { setVideoID, setVideoRef } from "../../services/actions";

import { BASEURL } from "../../services/fetcher";

const RecommendedVids = ({
  SpringAnim,
  initPager,
  videoHeight,
  videostyle,
  videoRef,
  setVidRef,
  audioRef,
  styles,
  colors,
  lecture,
  setVidID,
}) => {
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

  const [recommendations, setRecommendations] = useState([]);

  const getRecommendation = (text) => {
    const search_link = `${BASEURL}esearch/search/lecture/${text}/0/`;
    fetch(search_link)
      .then((res) => res.json())
      .then((json) => {
        setRecommendations(json.lectures.slice(1, 15));
      });
  };

  useEffect(() => {
    const text = lecture.title + " " + lecture.description;
    getRecommendation(text);
  }, [lecture]);

  const handleAcceptRecc = async (id: number) => {
    await videoRef.unloadAsync();
    await audioRef.unloadAsync();

    setVidID(id);
  };

  return (
    <View style={[styles.default_card, styles.marginBottom]}>
      <Text style={styles.h3}>Related videos</Text>
      {recommendations.map(
        (recc: {
          author: string;
          id: number;
          thumbnail: string;
          title: string;
          views: number;
        }) => (
          <TouchableOpacity
            onPress={() => handleAcceptRecc(recc.id)}
            key={recc.title}
            style={styles.recommendation}
          >
            <Image
              source={{ uri: recc.thumbnail }}
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
              <Text style={styles.h5}>{shorterText(recc.title, 50)}</Text>
              <View>
                <Text style={[styles.h5, { color: colors.secondary }]}>
                  {/* {recc.views}
                      <Separator /> */}
                  {recc.author}
                  <Separator />
                  {recc.views}
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
