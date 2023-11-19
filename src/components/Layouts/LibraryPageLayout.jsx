import Head from 'next/head';
import { Box, ButtonGroup, Flex } from '@chakra-ui/react';
import { ThemeToggleButton } from 'components/ThemeToggle';
import { UserMenu } from 'components/UserMenu';
import MainContentContainer from './MainContentContainer';
import { UserAuthWrapper } from 'components/Wrappers';
import { HeadTitle } from 'components/Head';

const LibraryPageLayout = ({ children, pageTitle, searchBar }) => (
  <>
    <Head>
      <HeadTitle pageTitle={pageTitle} />
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <UserAuthWrapper>
        <MainContentContainer>
          <Flex gap="18px" marginBottom="16px" width="100%">
            {searchBar}
            <ButtonGroup marginLeft="auto" spacing="15px" width="155px" justifyContent="flex-end">
              <UserMenu />
              <ThemeToggleButton />
            </ButtonGroup>
          </Flex>
          <Box minHeight="80vh" width="100%" sx={{ '&>div': { width: '100%' } }}>
            {children}
          </Box>
        </MainContentContainer>
      </UserAuthWrapper>
    </main>
  </>
);

export default LibraryPageLayout;
