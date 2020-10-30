import { combineReducers } from "redux";

import rootReducer from "./reducers/root-reducer";
import videoReducer from "./reducers/video-reducer";

export default combineReducers({
  token: rootReducer,
  video: videoReducer,
});
