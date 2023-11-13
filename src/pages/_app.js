import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { chakraThemeColors, chakraThemeTextStyles } from 'config/chakraTheme';
import 'styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

 const theme = extendTheme({
  colors: chakraThemeColors,
  textStyles: chakraThemeTextStyles,
  components: {
    Text: {
      baseStyle: (_props) => ({
        color: chakraThemeColors.primaryFontColor
      }),
      variants: {
        // used as <Text variant="secondary">
        secondary: (_props) => ({
          color: chakraThemeColors.secondaryFontColor
        })
      }
    }
  },

  styles: {
    global: (_props) => ({
      // Optionally set global CSS styles
      body: {
        color: chakraThemeColors.primaryFontColor
      }
    })
  }
});

const MyApp = ({ Component, pageProps }) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default MyApp;
