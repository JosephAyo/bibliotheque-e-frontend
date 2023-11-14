import Head from 'next/head';
import { Flex, Text } from '@chakra-ui/react';

const LibraryPageLayout = ({ children, pageTitle }) => (
  <>
    <Head>
      <title>Bibliotheque-E | {pageTitle}</title>
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <Text textStyle="headline-2-medium">Bibliotheque-E</Text>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        {children}
      </Flex>
    </main>
  </>
);

export default LibraryPageLayout;
