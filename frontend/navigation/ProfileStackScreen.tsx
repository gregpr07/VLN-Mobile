import React from "react";

import { TouchableOpacity, Platform } from "react-native";
import { connect } from "react-redux";

import { Feather } from "@expo/vector-icons";

import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../pages/profile";
import LoginScreen from "../pages/login";
import SettingScreen from "../pages/settings";

import { useTheme } from "@react-navigation/native";

import headerOptions from "./headerOptions";

const ProfileStack = createStackNavigator();

const ProfileStackScreen = ({ token }) => {
  const { colors, dark } = useTheme();

  return (
    <ProfileStack.Navigator screenOptions={{ ...headerOptions(colors) }}>
      {token.token ? (
        <>
          <ProfileStack.Screen
            name="profile"
            options={({ navigation }) => ({
              headerTitle: Platform.OS === "web" ? null : "videolectures.net",
              headerTitleStyle: {
                fontFamily: "SF-UI-semibold",
                fontSize: 24,
              },
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    height: 24,
                    width: 24,
                    marginRight: 20,
                  }}
                  onPress={() => navigation.push("settings")}
                >
                  <Feather name={"settings"} size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            })}
            component={ProfileScreen}
          />
        </>
      ) : (
        <ProfileStack.Screen
          name="login"
          options={({ navigation }) => ({
            headerTitle: Platform.OS === "web" ? null : "videolectures.net",
            headerTitleStyle: {
              fontFamily: "SF-UI-semibold",
              fontSize: 24,
            },
            headerRight: () => (
              <TouchableOpacity
                style={{
                  height: 24,
                  width: 24,
                  marginRight: 20,
                }}
                onPress={() => navigation.push("settings")}
              >
                <Feather name={"settings"} size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          })}
          component={LoginScreen}
        />
      )}
      <ProfileStack.Screen
        name="settings"
        options={({ navigation }) => ({
          title: "Settings",
        })}
        component={SettingScreen}
      />
    </ProfileStack.Navigator>
  );
};

const mapStateToProps = (state) => ({
  token: state.token,
});

export default connect(mapStateToProps, null)(ProfileStackScreen);
