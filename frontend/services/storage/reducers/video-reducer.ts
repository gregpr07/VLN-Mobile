import { Audio } from "expo-av";

export interface videoState {
  videoID: number;
  videoRef: any;
  audioRef: any;
  //! playing video or audio (video = 0, audio = 1)
  videoAudioPlay: number;
  showSlides: boolean;
  showNotes: boolean;
  playbackSpeed: number;
}

const videoReducer = (
  state = {
    videoID: null,
    videoRef: null,
    audioRef: new Audio.Sound(),
    videoAudioPlay: 0,
    showSlides: false,
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
    case "VIDEO_AUDIO_PLAY":
      return { ...state, videoAudioPlay: action.videoAudioPlay };
    case "SHOW_SLIDES":
      return { ...state, showSlides: action.showSlides };
    default:
      return state;
  }
};

export default videoReducer;
