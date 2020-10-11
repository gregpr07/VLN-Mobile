// https://blog.usejournal.com/persisting-user-authentication-in-a-react-native-app-778e028ac816

import AsyncStorage from "@react-native-community/async-storage";
import store from "./store";
const { video } = store.getState();

export const getToken = (token) => ({
  type: "GET_TOKEN",
  token,
});

export const saveToken = (token) => ({
  type: "SAVE_TOKEN",
  token,
});

export const removeToken = () => ({
  type: "REMOVE_TOKEN",
});

export const loading = (bool) => ({
  type: "LOADING",
  isLoading: bool,
});

export const error = (error) => ({
  type: "ERROR",
  error,
});

export const getUserToken = () => (dispatch) =>
  AsyncStorage.getItem("userToken")
    .then((data) => {
      dispatch(loading(false));
      dispatch(getToken(data));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || "ERROR"));
    });

export const saveUserToken = (data) => (dispatch) =>
  AsyncStorage.setItem("userToken", data)
    .then((disdata) => {
      dispatch(loading(false));
      dispatch(saveToken(data));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || "ERROR"));
    });

export const removeUserToken = () => (dispatch) =>
  AsyncStorage.removeItem("userToken")
    .then((data) => {
      dispatch(loading(false));
      dispatch(removeToken(data));
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || "ERROR"));
    });

//* VIDEO

export const videoID = (videoID) => ({
  type: "VIDEO_ID",
  videoID,
});

export const videoRef = (videoRef) => ({
  type: "VIDEO_REF",
  videoRef,
});

export const playbackSpeed = (playbackSpeed) => ({
  type: "PLAYBACK_SPEED",
  playbackSpeed,
});

export const setVideoID = (data) => (dispatch) => dispatch(videoID(data));

export const setVideoRef = (ref) => (dispatch) => dispatch(videoRef(ref));

export const setPlaybackSpeed = (speed) => (dispatch) =>
  dispatch(playbackSpeed(speed));
