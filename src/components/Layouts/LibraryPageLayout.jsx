import Head from 'next/head';
import { Flex } from '@chakra-ui/react';

const LibraryPageLayout = ({ children, pageTitle }) => (
  <>
    <Head>
      <title>Bibliotheque-E {pageTitle ? `| ${pageTitle}` : ''}</title>
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        maxWidth="1184px"
        marginLeft="auto"
        marginRight="auto">
        {children}
      </Flex>
    </main>
  </>
);

export default LibraryPageLayout;
