import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  Button,
} from "react-native";
import { connect } from "react-redux";
import { saveUserToken } from "../services/storage/actions";
import Constants from "expo-constants";

import * as WebBrowser from "expo-web-browser";

import { API } from "../services/fetcher";

import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import Container from "../components/Container";

const { width, height } = Dimensions.get("window");

const SignInScreen = ({ token, saveToken }: any) => {
  const { colors, dark } = useTheme();

  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const _signInAsync = (token: string) => {
    saveToken(token)
      .then(() => {
        console.log("logged in");
        setIsError(false);
      })
      .catch((error: any) => {
        setIsError(error);
      });
  };

  const postLogin = () => {
    if (userName && password) {
      setLoading(true);
      fetch(`${API}auth/login/`, {
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
        .then((json) => {
          json.token
            ? _signInAsync(json.token)
            : setIsError(json.non_field_errors[0]);
          setLoading(false);
        });
    }
  };

  const _handlePressButtonAsync = async () => {
    await WebBrowser.openBrowserAsync(
      "http://videolectures.net/site/accounts/register/"
    );
  };

  let pass: any;

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
      color: colors.text,
    },
    h4: {
      fontSize: 18,
      fontFamily: "SF-UI-medium",
      alignContent: "center",
    },
    input: {
      width: 315,
      height: 70,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowRadius: 19,
      shadowOpacity: 1,
      paddingHorizontal: 35,
      fontFamily: "SF-UI-semibold",

      color: colors.text,
    },
  });

  return (
    <Container>
      <ScrollView keyboardDismissMode="on-drag">
        <View style={styles.container}>
          <Text
            style={[
              styles.h3,
              {
                maxWidth: 250,
                textAlign: "center",
                marginTop: 3,
              },
            ]}
          >
            Enter your login details to access your account
          </Text>
          <View style={{ paddingVertical: 75 }}>
            {isError ? (
              <Text
                style={[
                  styles.h4,
                  {
                    maxWidth: 300,
                    textAlign: "center",
                    marginBottom: 14,
                    color: colors.primary,
                  },
                ]}
              >
                {isError}
              </Text>
            ) : null}
            <TextInput
              value={userName}
              autoCompleteType={"username"}
              //autoFocus
              autoCorrect={false}
              returnKeyType={"next"}
              autoCapitalize={"none"}
              onSubmitEditing={() => pass.focus()}
              placeholder={"Username"}
              placeholderTextColor={colors.secondary}
              clearButtonMode={"while-editing"}
              onChangeText={(text) => setUserName(text)}
              keyboardAppearance={dark ? "dark" : "light"}
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
              ref={(ref) => (pass = ref)}
              value={password}
              autoCompleteType={"password"}
              autoCorrect={false}
              onChangeText={(text) => setPassword(text)}
              clearTextOnFocus={true}
              returnKeyType={"send"}
              autoCapitalize={"none"}
              placeholder={"Password"}
              placeholderTextColor={colors.secondary}
              onSubmitEditing={postLogin}
              keyboardAppearance={dark ? "dark" : "light"}
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
              {" "}
              {loading ? (
                <ActivityIndicator
                  //? 15 is for centering - very hacky!!
                  style={{
                    left: width / 2 - 15,
                    top: height / 2,
                    position: "absolute",
                  }}
                  size="small"
                />
              ) : (
                "LOGIN"
              )}
            </Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight onPress={_handlePressButtonAsync}>
          <Text
            style={[
              styles.h3,
              {
                marginTop: 50,
                color: colors.text,
                textAlign: "center",
                textDecorationLine: "underline",
              },
            ]}
          >
            ... or register
          </Text>
        </TouchableHighlight>
      </ScrollView>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  saveToken: (str: string) => dispatch(saveUserToken(str)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
