import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

import { noHeadFetcher } from "../services/fetcher";

import { useTheme } from "@react-navigation/native";

import { shorterText, numberWithCommas } from "../services/functions";

import { connect } from "react-redux";
import { setVideoID } from "../services/storage/actions";

const Lectures = ({
  videoRef,
  audioRef,
  setVidID,
  HeaderComponent,
  navigation,
  padding,
  styles,
  fetchurl,
  default_lectures = null,
}: any) => {
  const { colors, dark } = useTheme();

  const [lectures, setLectures] = useState(default_lectures);
  const [paginate, setPaginate] = useState("");

  useEffect(() => {
    if (!default_lectures)
      noHeadFetcher(fetchurl).then((json) => {
        setLectures(json.results), setPaginate(json.next);
      });
  }, [fetchurl]);

  const loadMoreLecs = () => {
    if (paginate && !default_lectures) {
      fetch(paginate)
        .then((res) => res.json())
        .then((json) => {
          const newlecs = lectures.concat(json.results);
          setLectures(newlecs);
          setPaginate(json.next);
        });
    }
  };

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
  const RenderItem = ({ item }: any) => (
    <View
      style={{
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowRadius: 19,
        shadowOpacity: 1,

        marginTop: padding,
        backgroundColor: colors.card,
        //padding: padding,
        borderRadius: 15,

        marginRight: padding,

        maxWidth: 600,

        flex: 1,

        marginLeft: padding,
      }}
    >
      <TouchableOpacity
        onPress={() => _handleResultsClick(item)}
        //key={item.title}
        style={{ flexDirection: "row" }}
      >
        <Image
          source={
            item.thumbnail
              ? {
                  uri: item.thumbnail,
                }
              : dark
              ? require("../assets/icons/videolecture-net-dark.png")
              : require("../assets/icons/videolecture-net-light.png")
          }
          style={{
            height: 80,
            maxWidth: (80 / 9) * 16,
            flex: 3,

            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            resizeMode: item.thumbnail ? "cover" : "contain",
          }}
        />
        <View style={{ flex: 4, padding: 6, alignContent: "center" }}>
          <Text
            style={{
              paddingBottom: 2,
              fontSize: 14,
              fontFamily: "SF-UI-medium",
              color: colors.text,
            }}
          >
            {shorterText(item.title, 75)}
          </Text>
          <View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "SF-UI-medium",
                color: colors.secondary,
              }}
            >
              {item.author.name}
              <Separator />
              {numberWithCommas(item.views)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={lectures}
        renderItem={RenderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<HeaderComponent />}
        ListFooterComponent={() => <View style={{ marginBottom: padding }} />}
        //getNativeScrollRef={(ref) => (flatlistRef = ref)}
        keyboardDismissMode={"on-drag"}
        numColumns={width / 600 > 1 ? 2 : 1}
        onEndReached={loadMoreLecs}
      />
    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Lectures);
