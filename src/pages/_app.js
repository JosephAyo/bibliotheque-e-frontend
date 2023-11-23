import { Box, ChakraProvider, extendTheme, theme as chakraTheme } from '@chakra-ui/react';
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
import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { clearAllUserData } from 'config/axios';

const { definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const fonts = {
  ...chakraTheme.fonts,
  body: `Inter`,
  heading: `Inter`
};

const customModalVariant = definePartsStyle({
  overlay: {
    bg: '#555555ee',

    // Let's also provide dark mode alternatives
    _dark: {
      bg: '#000000ee'
    }
  }
});

const theme = extendTheme({
  fonts,
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
          _hover: {
            _disabled: {
              backgroundColor: 'actionPrimary.200'
            }
          },
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
          _hover: {
            _disabled: {
              backgroundColor: 'actionSecondary.200'
            }
          },
          ...chakraThemeTextStyles.button
        }),
        // used as <Button variant="delete_action">
        delete_action: (_props) => ({
          color: 'whiteAlpha.900',
          backgroundColor: 'red.500',
          _hover: {
            _disabled: {
              backgroundColor: 'red.500'
            }
          },
          ...chakraThemeTextStyles.button
        })
      }
    },
    Input: {
      variants: {
        // used as <Input variant="plain">
        plain: (_props) => ({
          field: {
            backgroundColor: mode('white', 'unset')(_props)
          }
        }),
        // used as <Input variant="themed">
        themed: (_props) => ({
          field: {
            backgroundColor: mode('#f6f6f6', 'gray.600')(_props)
          }
        })
      }
    },
    NumberInput: {
      variants: {
        // used as <Input variant="themed">
        themed: (_props) => ({
          field: {
            backgroundColor: mode('#f6f6f6', 'gray.600')(_props)
          }
        })
      }
    },
    Textarea: {
      variants: {
        // used as <Textarea variant="themed">
        themed: (_props) => ({
          backgroundColor: mode('#f6f6f6', 'gray.600')(_props),
          borderWidth: '1px'
        })
      }
    },
    Modal: {
      variants: {
        themed: customModalVariant
      }
    }
  }
});

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
        useAppStore.getState().userSlice.clearCurrentUser();
        clearAllUserData();
      }
      // if (query.state.data !== undefined) {
      //   errorToast(getAxiosErrorDetail(error));
      // }
    }
  })
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
