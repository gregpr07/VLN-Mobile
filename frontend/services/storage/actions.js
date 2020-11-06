// https://blog.usejournal.com/persisting-user-authentication-in-a-react-native-app-778e028ac816
import AsyncStorage from "@react-native-community/async-storage";
import { API } from "../fetcher";

// =======================================================================
// ROOT
// =======================================================================

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

export const getUserToken = () => (dispatch) => {
  const verifyToken = (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${data}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${API}auth/user/`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        dispatch(loading(false));
        if (json.id) {
          dispatch(getToken(data));
          console.log("Token verified.");
        } else {
          console.log("Invalid token.");
        }
      })
      .catch((error) => console.log("error", error));
  };
  AsyncStorage.getItem("userToken")
    .then((data) => {
      verifyToken(data);
    })
    .catch((err) => {
      dispatch(loading(false));
      dispatch(error(err.message || "ERROR"));
    });
};

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

// =======================================================================
// VIDEO
// =======================================================================

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

export const videoAudioPlay = (videoAudioPlay) => ({
  type: "VIDEO_AUDIO_PLAY",
  videoAudioPlay,
});

export const showSlides = (showSlides) => ({
  type: "SHOW_SLIDES",
  showSlides,
});

export const setVideoID = (data) => (dispatch) => dispatch(videoID(data));

export const setVideoRef = (ref) => (dispatch) => dispatch(videoRef(ref));

export const setPlaybackSpeed = (speed) => (dispatch) =>
  dispatch(playbackSpeed(speed));

export const setVideoAudioPlay = (num) => (dispatch) =>
  dispatch(videoAudioPlay(num));

export const setShowSlides = (bol) => (dispatch) => dispatch(showSlides(bol));
