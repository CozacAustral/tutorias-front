import { baseTheme, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    primary: "#172187",
    secondary: "#318ae4",
    light_gray: "#D9D9D9",
    softPink: "#FCF5F9",
    Very_Light_Gray: "#F9F9F9",
    red: {
      50: "#fff5f5",
      100: "#fed7d7",
      200: "#feb2b2",
      300: "#fc8181",
      400: "#f56565",
      500: "#e53e3e", 
      600: "#c53030",
      700: "#9b2c2c",
      800: "#822727",
      900: "#63171b",
    },
  },
});

export default customTheme;
