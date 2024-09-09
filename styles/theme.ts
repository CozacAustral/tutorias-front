import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
    colors: {
    primary: '#172187',
    violet: '#7F00FF',
    secondary: '#318ae4',
    red: '#e53e3e',
    light_gray: '#D9D9D9',
    softPink: '#FCF5F9',
    paleGray: '#F9F9F9',
    white: '#FFFFFF',
    gray: '#B5B7C0',
    Green: '#38A169',
},
fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Montserrat', sans-serif`,
},
});

export default customTheme;
