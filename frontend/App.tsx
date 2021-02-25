import React from "react";

import App from "./Navigation";

import { Provider } from "react-redux";
import store from "./services/storage/store";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppearanceProvider } from "react-native-appearance";

export default () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </SafeAreaProvider>
  </Provider>
);
