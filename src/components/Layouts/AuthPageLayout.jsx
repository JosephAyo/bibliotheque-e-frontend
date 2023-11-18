import Head from 'next/head';
import { Flex, Text } from '@chakra-ui/react';
import { BsBookHalf } from 'react-icons/bs';
import RouterReadyWrapper from './RouterReadyWrapper';

const AuthPageLayout = ({ children, pageTitle }) => (
  <>
    <Head>
      <title>Bibliotheque-E {pageTitle ? `| ${pageTitle}` : ''}</title>
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <RouterReadyWrapper>
        <Flex alignItems="center" position="fixed" top="20px" left="20px">
          <BsBookHalf size={48} />
          <Text textStyle="headline-4-medium" marginLeft="4px">
            Bibliotheque-E
          </Text>
        </Flex>
        <Flex height="100vh" alignItems="center" justifyContent="center">
          {children}
        </Flex>
      </RouterReadyWrapper>
    </main>
  </>
);

export default AuthPageLayout;
