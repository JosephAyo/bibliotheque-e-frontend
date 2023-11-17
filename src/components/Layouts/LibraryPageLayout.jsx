import Head from 'next/head';
import { Box, ButtonGroup, Flex } from '@chakra-ui/react';
import { ThemeToggleButton } from 'components/ThemeToggle';
import { UserMenu } from 'components/UserMenu';

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
          <ButtonGroup marginLeft="auto" spacing="15px" width="155px" justifyContent="flex-end">
            <UserMenu />
            <ThemeToggleButton />
          </ButtonGroup>
        </Flex>
        <Box>{children}</Box>
      </Flex>
    </main>
  </>
);

export default LibraryPageLayout;
