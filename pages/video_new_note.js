import React, { useState } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  StyleSheet,
} from "react-native";

export default function ModalScreen({ navigation }) {
  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  return (
    <View style={modal_styles.centeredView}>
      <View style={modal_styles.modalView}>
        <Text style={modal_styles.h5}>Add new note</Text>
        <TextInput
          style={modal_styles.textinput}
          onChangeText={(text) => setNoteText(text)}
          value={noteText}
          autoFocus={true}
          //onSubmitEditing={handleSubmit}
          clearButtonMode={"while-editing"}
          multiline
          placeholder={"Compose your note here"}
          placeholderTextColor="#BDBDBD"
        />
        <TouchableHighlight
          style={modal_styles.button_default}
          onPress={() => {
            console.log(noteText);
            navigation.goBack();
          }}
        >
          <Text style={modal_styles.textStyle}>
            {noteText ? "Done" : "Cancel"}
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const modal_styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "stretch",
    maxWidth: 500,
  },
  textinput: {
    marginVertical: 20,
    alignSelf: "stretch",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button_default: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "#5DB075",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  h5: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
