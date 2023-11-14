import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { chakraThemeColors, chakraThemeTextStyles } from 'config/chakraTheme';
import { mode } from '@chakra-ui/theme-tools';
import 'styles/globals.css';
import ThemeToggleButton from 'components/ThemeToggle';

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
        color: mode(chakraThemeColors.primaryFontColor, 'whiteAlpha.900')(_props)
      })
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
