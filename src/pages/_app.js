import { ChakraProvider } from '@chakra-ui/react';
import 'styles/globals.css';

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
