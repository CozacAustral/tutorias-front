import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import AuthContextProvider from "./contexts/AuthContext";
import  customTheme from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
    <ChakraProvider theme={customTheme} resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
