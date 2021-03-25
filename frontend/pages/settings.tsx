import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { removeUserToken } from "../services/storage/actions";
import defaultStyles from "../constants/DefaultStyleSheet";

import { API } from "../services/fetcher";

import { useTheme } from "@react-navigation/native";
import { color } from "react-native-reanimated";
import Container from "../components/Container";

import { Feather } from "@expo/vector-icons";

const padding = 12;

const SignOutScreen = ({ token, removeUserToken }: any) => {
  const { colors, dark } = useTheme();

  const [error, setError] = useState(false);

  const _signOutAsync = () => {
    console.log(token);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token.token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API + "auth/logout/", requestOptions).then((res) =>
      console.log("Removed server token")
    );

    removeUserToken()
      .then(() => {
        console.log("logged out");
      })
      .catch((error: any) => {
        setError(error);
      });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: padding,
    },
    h3: {
      fontSize: 20,
      fontFamily: "SF-UI-semibold",
      alignContent: "center",
      color: colors.text,
      paddingVertical: 5,
    },
    bold: {
      fontFamily: "SF-UI-semibold",
    },
    card: {
      width: "100%",
      borderRadius: 15,
      backgroundColor: colors.card,
      ...defaultStyles.shadow,

      paddingHorizontal: 20,
      paddingVertical: 26,
      marginVertical: 15,
    },
  });
  return (
    <Container>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginVertical: 25, width: "100%" }}>
            <View style={styles.card}>
              <Text style={styles.h3}>Prefered playback speed</Text>
              <Text style={styles.h3}>Prefered : slides/video</Text>
              <Text style={styles.h3}>Play in background (true/false)</Text>
            </View>
            {token.token && (
              <>
                <View style={styles.card}>
                  <Text style={styles.h3}>Update email</Text>
                  <Text style={styles.h3}>Change password</Text>
                  <Text style={styles.h3}>Remove user data</Text>
                  <Text style={styles.h3}>Do not track</Text>
                  <Text style={styles.h3}>Privacy and terms (GDPR)</Text>
                  <Text style={styles.h3}>Contact us</Text>
                </View>

                <TouchableOpacity onPress={_signOutAsync}>
                  <View style={{ flexDirection: "row", paddingLeft: 20 }}>
                    <Text
                      style={[
                        {
                          lineHeight: 30,
                          letterSpacing: 1,
                          textAlign: "center",
                          color: colors.text,
                          fontSize: 16,
                        },
                        styles.bold,
                      ]}
                    >
                      Sign out
                    </Text>
                    <Feather
                      name={"log-out"}
                      size={24}
                      style={{ paddingLeft: 8 }}
                      color={colors.text}
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignOutScreen);
