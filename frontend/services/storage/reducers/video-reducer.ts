import { Audio } from "expo-av";

export interface videoState {
    videoID: number;
    videoRef: any;
    audioRef: any;
    showNotes: boolean;
    playbackSpeed: number;
}

const videoReducer = (
    state = {
        videoID: null,
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

export default videoReducer;
