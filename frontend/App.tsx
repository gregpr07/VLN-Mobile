import React from "react";

import App from "./Navigation";

import { Provider } from "react-redux";
import store from "./services/store";

export default () => (
  <Provider store={store}>
    <App />

  </Provider>
); 
