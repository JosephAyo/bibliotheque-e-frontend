import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { chakraThemeColors, chakraThemeTextStyles } from 'config/chakraTheme';
import 'styles/globals.css';
import { ThemeToggleButton } from 'components/ThemeToggle';

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
    // Text: {
    //   baseStyle: (_props) => ({
    //     color: mode(chakraThemeColors.primaryFontColor, 'whiteAlpha.900')
    //   })
    // },
    Button: {
      variants: {
        // used as <Button variant="primary_action">
        primary_action: (_props) => ({
          color: 'whiteAlpha.900',
          backgroundColor: 'actionPrimary.200'
        }),
        // used as <Button variant="secondary_action">
        secondary_action: (_props) => ({
          color: 'whiteAlpha.900',
          backgroundColor: 'actionSecondary.200'
        })
      }
    }
  }
});

const MyApp = ({ Component, pageProps }) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <ThemeToggleButton />
      <Component {...pageProps} />
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default MyApp;
