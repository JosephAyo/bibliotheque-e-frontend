import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { chakraLayerStyles, chakraThemeColors, chakraThemeTextStyles } from 'config/chakraTheme';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globals.css';
import { ThemeToggleButton } from 'components/ThemeToggle';
import { needAbsoluteThemeToggle } from 'config/layout';
import { ToastContainer } from 'react-toastify';
import { AxiosError } from 'axios';
import useAppStore from 'lib/store';

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
    },
    Input: {
      variants: {
        // used as <Input variant="auth_plain">
        auth_plain: (_props) => ({
          field: {
            backgroundColor: mode('white', 'unset')(_props)
          }
        }),
        // used as <Input variant="auth_filled">
        auth_filled: (_props) => ({
          field: {
            backgroundColor: mode('#f6f6f6', 'gray.600')(_props)
          }
        })
      }
    }
  }
});

const MyApp = ({ Component, pageProps, router }) => {
  const {
    userSlice: { clearCurrentUser }
  } = useAppStore();
  const isAbsoluteNeeded = needAbsoluteThemeToggle.includes(router.pathname);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // 🎉 only show error toasts if we already have data in the cache
        // which indicates a failed background update
        console.log({
          query,
          queryCacheError: error
        });
        if (error && error instanceof AxiosError && query.queryKey.includes('viewProfile')) {
          clearCurrentUser();
        }
        // if (query.state.data !== undefined) {
        //   errorToast(getAxiosErrorDetail(error));
        // }
      }
    })
  });

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
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Component {...pageProps} />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
