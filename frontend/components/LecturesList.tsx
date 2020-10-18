import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

import { useTheme } from "@react-navigation/native";

import { shorterText, numberWithCommas } from "../services/functions";

import { connect } from "react-redux";
import { setVideoID } from "../services/actions";

const Lectures = ({
  videoRef,
  audioRef,
  setVidID,
  HeaderComponent,
  navigation,
  padding,
  styles,
  lectures,
}: any) => {
  const { colors, dark } = useTheme();

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

        maxWidth: 500,

        flex: 1,
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
              {item.author}
              <Separator />
              {numberWithCommas(item.views)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: padding }}>
      <FlatList
        data={lectures}
        renderItem={RenderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<HeaderComponent />}
        ListFooterComponent={() => <View style={{ marginBottom: padding }} />}
        //getNativeScrollRef={(ref) => (flatlistRef = ref)}
        keyboardDismissMode={"on-drag"}
        numColumns={width / 600 > 1 ? 2 : 1}
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