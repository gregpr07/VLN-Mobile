import React from "react";

import App from "./Navigation";

import { Provider } from "react-redux";
import store from "./services/storage/store";

import { SafeAreaProvider } from "react-native-safe-area-context";

export default () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  </Provider>
);
