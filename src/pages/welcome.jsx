import Head from 'next/head';
import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { BsBookHalf } from 'react-icons/bs';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bibliotheque-E</title>
        <meta name="description" content="Bibliotheque Electronic" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex height="100vh" alignItems="center" justifyContent="center">
          <Flex flexDirection="column" alignItems="center">
            <Flex alignItems="center">
              <BsBookHalf size={64} />
              <Text textStyle="headline-2-medium" marginLeft="4px">
                Bibliotheque-E
              </Text>
            </Flex>
            <VStack spacing="24px" align="stretch" width="380px" marginTop="90px">
              <Link href="/signup">
                <Button width="100%" variant="primary_action">
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button width="100%" variant="secondary_action">
                  Login
                </Button>
              </Link>
            </VStack>
          </Flex>
        </Flex>
      </main>
    </>
  );
}
