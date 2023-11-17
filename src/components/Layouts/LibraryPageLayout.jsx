import Head from 'next/head';
import { Box, ButtonGroup, Flex, IconButton } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import { ThemeToggleButton } from 'components/ThemeToggle';

const LibraryPageLayout = ({ children, pageTitle, searchBar }) => (
  <>
    <Head>
      <title>Bibliotheque-E {pageTitle ? `| ${pageTitle}` : ''}</title>
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="893px"
        marginLeft="auto"
        marginRight="auto"
        paddingY="20px"
        paddingX="23px">
        <Flex gap="18px" marginBottom="16px" width="100%">
          {searchBar}
          <ButtonGroup marginLeft="auto" spacing="10px" width="155px" justifyContent="flex-end">
            <IconButton icon={<FaUserCircle />} rounded="100%" />
            <ThemeToggleButton />
          </ButtonGroup>
        </Flex>
        <Box>{children}</Box>
      </Flex>
    </main>
  </>
);

export default LibraryPageLayout;
