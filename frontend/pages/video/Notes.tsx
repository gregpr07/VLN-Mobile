import React, { useState, useEffect, useRef } from "react";
import {
  View,
  // Pressable,
  Animated,
  Button,
  TouchableHighlight,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Keyboard,
} from "react-native";

import { connect } from "react-redux";

import { setVideoID, setVideoRef } from "../../services/actions";

import { API } from "../../services/fetcher";

import { Ionicons } from "@expo/vector-icons";

// functions
import { YoutubeTime, compare } from "../../services/functions";

import { useTheme } from "@react-navigation/native";

const Notes = ({
  showNotes,
  token,
  videoRef,
  audioRef,
  currentPager,
  styles,
  padding,
  quitNotes,
}) => {
  const { colors, dark } = useTheme();

  const ITEM_SIZE = 200;
  const SEPARATOR_SIZE = 10;

  const handleTimestamp = (timestamp: number) => {
    if (currentPager === 0) {
      videoRef.setPositionAsync(timestamp);
    }
    if (currentPager === 1) {
      audioRef.setPositionAsync(timestamp);
    }
    //console.log(videoRef);
  };

  const [notes, setNotes] = useState([]);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${token}`);

  const requestOptions: any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const getNotes = () => {
    fetch(API + "note/lecture/1/", requestOptions)
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        } else return null;
      })
      .then((json) => {
        if (json) {
          setNotes(json.results);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getNotes();
  }, []);

  const RenderNote = ({ item, index }: any) => {
    return (
      <View
        style={{
          paddingVertical: 6,
        }}
      >
        <TouchableHighlight onPress={() => handleTimestamp(item.timestamp)}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={{ color: colors.secondary }}>
              {YoutubeTime(item.timestamp)}
            </Text>
            <Ionicons
              name={"ios-play-circle"}
              size={16}
              color={colors.secondary}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableHighlight>

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
    const handleChangeText = async (text: string) => {
      setNoteText(text);
      if (text.length === 1) {
        const { positionMillis } = await videoRef.getStatusAsync();

        setTimestamp(positionMillis);
        // console.log(positionMillis);
      }
    };
    const handleNoteSubmit = () => {
      if (noteText) {
        let newnotes: any = [...notes, output_obj].sort(compare);
        setNotes(newnotes);
      }
      Keyboard.dismiss();
      setNoteText("");
      //console.log(output_obj);
    };
    return (
      <View
      /* keyboardShouldPersistTaps="handled" */
      >
        <View style={{}}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TextInput
              style={{
                marginBottom: 5,

                paddingBottom: 5,
                flex: 9,

                color: colors.text,
              }}
              onChangeText={handleChangeText}
              value={noteText}
              autoFocus={true}
              //onSubmitEditing={handleSubmit}
              clearButtonMode={"always"}
              multiline
              placeholder={"Add new note here"}
              placeholderTextColor="#BDBDBD"
              keyboardAppearance={dark ? "dark" : "light"}
            />
            <TouchableOpacity onPress={() => quitNotes()}>
              <Ionicons name={"ios-close"} size={30} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {noteText ? (
            <TouchableHighlight
              style={{
                paddingVertical: 10,
                marginBottom: 6,
                borderRadius: 10,
                backgroundColor: "#5468fe",

                width: 200,

                shadowColor: colors.shadow,
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowRadius: 25,
                shadowOpacity: 1,
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
      <Text
        style={[
          styles.h4,
          { color: "gray", marginVertical: 20, textAlign: "center" },
        ]}
      >
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
      quitNotes();
    }
  };

  return (
    <View
      style={[
        styles.default_card,
        {
          margin: padding,
        },
      ]}
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

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
