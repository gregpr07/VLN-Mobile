import React, { useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { removeUserToken } from "../services/actions";
import Constants from "expo-constants";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";

const padding = 20;

const SignOutScreen = ({ token, removeUserToken }: any) => {
  const [error, setError] = useState(false);

  const _signOutAsync = () => {
    removeUserToken()
      .then(() => {
        console.log("logged out");
      })
      .catch((error: any) => {
        setError(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>Blabla</Text>
      </View>
      <TouchableOpacity onPress={_signOutAsync}>
        <Text
          style={[
            {
              lineHeight: 22,
              letterSpacing: 1,
              textAlign: "center",
              color: "#5468ff",
              fontSize: 16,
            },
            styles.bold,
          ]}
        >
          Sign out
        </Text>
      </TouchableOpacity>
      <Text>{token.token}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: padding,
  },
  h3: {
    fontSize: 20,
    fontFamily: "SF-UI-medium",
    alignContent: "center",
    color: "rgb(52, 67, 86)",
  },
  bold: {
    fontFamily: "SF-UI-semibold",
  },
  card: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "rgba(60, 128, 209, 0.09)",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 19,
    shadowOpacity: 1,

    paddingHorizontal: 20,
    paddingVertical: 26,
  },
});

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignOutScreen);
