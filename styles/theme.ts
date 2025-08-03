import { baseTheme, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    primary: "#172187", //color principal
    secondary: "#318ae4",
    red: "#e53e3e",
    light_gray: "#D9D9D9",
    softPink: "#FCF5F9",
    Very_Light_Gray: "#F9F9F9",
  },

  breakpoints: {
    ...baseTheme.breakpoints,
    notebook: '64em',
    lg: '80em'
  }
});

export default customTheme;
