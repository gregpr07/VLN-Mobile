import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { connect } from "react-redux";
import { saveUserToken } from "../services/actions";
import Constants from "expo-constants";

import { API } from "../services/fetcher";

const SignInScreen = ({ token, saveToken }: any) => {
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const _signInAsync = (token: string) => {
    saveToken(token)
      .then(() => {
        console.log("logged in");
      })
      .catch((error: any) => {
        setError(error);
      });
  };

  const postLogin = () => {
    fetch(`${API}/auth/login/`, {
      method: "POST",
      body: JSON.stringify({
        username: userName,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.h3, styles.bold]}>Log in</Text>
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
      <Button onPress={() => _signInAsync("blabla")} title={"login"} />
      <View style={{ paddingVertical: 75 }}>
        <TextInput
          value={userName}
          autoCompleteType={"username"}
          autoFocus
          onChangeText={(text) => setUserName(text)}
          style={[
            styles.input,
            {
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              marginBottom: 1,
            },
          ]}
        />
        <TextInput
          value={password}
          autoCompleteType={"password"}
          onChangeText={(text) => setPassword(text)}
          style={[
            styles.input,
            { borderBottomRightRadius: 15, borderBottomLeftRadius: 15 },
          ]}
          secureTextEntry
        />
      </View>
      <TouchableHighlight
        onPress={postLogin}
        style={{
          width: 315,
          height: 58,
          borderRadius: 15,
          backgroundColor: "#5468ff",
          shadowColor: "rgba(84, 104, 255, 0.3)",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowRadius: 25,
          shadowOpacity: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "SF-UI-medium",
            color: "white",
            letterSpacing: 1,
          }}
        >
          CONTINUE
        </Text>
      </TouchableHighlight>
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
  input: {
    width: 315,
    height: 70,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(60, 128, 209, 0.09)",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 19,
    shadowOpacity: 1,
    paddingHorizontal: 35,
    fontFamily: "SF-UI-semibold",
  },
});

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  saveToken: (str: string) => dispatch(saveUserToken(str)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
