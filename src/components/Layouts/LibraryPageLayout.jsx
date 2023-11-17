import Head from 'next/head';
import { Box, ButtonGroup, Flex } from '@chakra-ui/react';
import { ThemeToggleButton } from 'components/ThemeToggle';
import { UserMenu } from 'components/UserMenu';
import MainContentContainer from './MainContentContainer';

const LibraryPageLayout = ({ children, pageTitle, searchBar }) => (
  <>
    <Head>
      <title>Bibliotheque-E {pageTitle ? `| ${pageTitle}` : ''}</title>
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <MainContentContainer>
        <Flex gap="18px" marginBottom="16px" width="100%">
          {searchBar}
          <ButtonGroup marginLeft="auto" spacing="15px" width="155px" justifyContent="flex-end">
            <UserMenu />
            <ThemeToggleButton />
          </ButtonGroup>
        </Flex>
        <Box>{children}</Box>
      </MainContentContainer>
    </main>
  </>
);

export default LibraryPageLayout;
