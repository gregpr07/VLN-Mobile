export const colors = {
  darkGreyBlue: "#344356",
  //dark: "#171531",
  dark: "rgb(18, 18, 19)",
  darkBlueGrey: "#232048",
  twilight: "#555093",
  darkGreyBlueTwo: "#2e2a5d",
  backCloseButtonStyle2: "#5468ff",
  iconBaseOfCta2: "#3d56f0",
  paleGrey: "#f8fafc",
  veryLightPink: "#eeeeee",
  dodgerBlue: "#499cff",
  darkSkyBlue: "#3d82f0",
  aquamarine: "#00d9cd",
  veryLightBlue: "#e8eef4",
  orangish: "rgb(255,159,10)",
  lightPeriwinkle: "#d4dce7",
  pastelBlue: "#aeb8ff",
  iconBaseOfCta22: "#01c6bb",
  whiteBackground: "rgb(242, 242, 242)",
};

export interface theme {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    third: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    shadow: string;
  };
}

export const LightTheme: theme = {
  dark: false,
  colors: {
    primary: colors.twilight,
    secondary: colors.twilight,
    third: "rgb(97, 98, 100)",
    background: colors.whiteBackground,
    card: "rgb(255, 255, 255)",
    text: colors.dark,
    border: "white",
    notification: "rgb(255, 69, 58)",
    shadow: "rgba(60, 128, 209, 0.09)",
  },
};

export const DarkTheme: theme = {
  dark: true,
  colors: {
    primary: colors.orangish,
    secondary: "rgb(154, 156, 157)",
    third: "rgb(97, 98, 100)",
    background: "black", //colors.dark,
    card: colors.dark,
    text: "white",
    border: colors.darkBlueGrey,
    notification: "rgb(255, 69, 58)",
    shadow: "#5468FF10",
  },
};
