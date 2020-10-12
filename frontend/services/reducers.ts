import { combineReducers } from "redux";
import { Audio } from "expo-av";

const rootReducer = (
  state = {
    token: {},
    loading: true,
    error: null,
  },
  action
) => {
  switch (action.type) {
    case "GET_TOKEN":
      return { ...state, token: action.token };
    case "SAVE_TOKEN":
      return { ...state, token: action.token };
    case "REMOVE_TOKEN":
      return { ...state, token: action.token };
    case "LOADING":
      return { ...state, loading: action.isLoading };
    case "ERROR":
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export interface videoState {
  videoID: number;
  videoRef: any;
  audioRef: any;
  showNotes: boolean;
  playbackSpeed: number;
}

const videoReducer = (
  state = {
    videoID: 10252,
    videoRef: null,
    audioRef: new Audio.Sound(),
    showNotes: false,
    playbackSpeed: 1,
  },
  action
) => {
  switch (action.type) {
    case "VIDEO_ID":
      return { ...state, videoID: action.videoID };
    case "VIDEO_REF":
      return { ...state, videoRef: action.videoRef };
    case "PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.playbackSpeed };
    default:
      return state;
  }
};

export default combineReducers({
  token: rootReducer,
  video: videoReducer,
});