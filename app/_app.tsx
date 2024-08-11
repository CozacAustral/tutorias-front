import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import AuthContextProvider from "./contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
    <ChakraProvider >
      <Component {...pageProps} />
    </ChakraProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
