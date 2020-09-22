import React, { useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { removeUserToken } from "../services/actions";
import Constants from "expo-constants";

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
      <Text style={[styles.h3, styles.bold]}>Sign out</Text>
      <Text
        style={[
          styles.h3,
          {
            maxWidth: 250,

            marginTop: 3,
          },
        ]}
      >
        Enter your login details to access your account
      </Text>
      <Button onPress={_signOutAsync} title={"Sign out"} />
      <Text>{token.token}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight + 16,
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
});

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignOutScreen);
