import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
    <ChakraProvider >
      <Component {...pageProps} />
    </ChakraProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
