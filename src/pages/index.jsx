import Head from 'next/head';
import { Button, Flex, Text, VStack } from '@chakra-ui/react';

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
            <Text textStyle="headline-2-medium">Bibliotheque-E</Text>
            <VStack spacing="24px" align="stretch" width="380px" marginTop="90px">
              <Button colorScheme="actionPrimary">Create Account</Button>
              <Button colorScheme="actionSecondary" color="white">
                Login
              </Button>
            </VStack>
          </Flex>
        </Flex>
      </main>
    </>
  );
}
