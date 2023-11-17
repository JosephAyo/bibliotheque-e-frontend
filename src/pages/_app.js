import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { chakraLayerStyles, chakraThemeColors, chakraThemeTextStyles } from 'config/chakraTheme';
import 'styles/globals.css';
import { ThemeToggleButton } from 'components/ThemeToggle';
import { needAbsoluteThemeToggle } from 'config/layout';

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
  layerStyles: chakraLayerStyles,
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
          backgroundColor: 'actionPrimary.200',
          ...chakraThemeTextStyles.button
        }),
        // used as <Button variant="primary_action_themed">
        primary_action_themed: (_props) => ({
          color: 'whiteAlpha.900',
          backgroundColor: mode('actionPrimaryLight.200', 'actionPrimaryDark.200')(_props),
          ...chakraThemeTextStyles.button
        }),
        // used as <Button variant="secondary_action">
        secondary_action: (_props) => ({
          color: 'whiteAlpha.900',
          backgroundColor: 'actionSecondary.200',
          ...chakraThemeTextStyles.button
        })
      }
    }
  }
});

const MyApp = ({ Component, pageProps, router }) => {
  const isAbsoluteNeeded = needAbsoluteThemeToggle.includes(router.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {isAbsoluteNeeded ? (
          <Box position="absolute" top="20px" right="20px">
            <ThemeToggleButton />
          </Box>
        ) : (
          ''
        )}
        <Component {...pageProps} />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
