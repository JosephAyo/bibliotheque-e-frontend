import Head from 'next/head';
import Image from 'next/image';
import {
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue('gray.100', 'gray.600');
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
          <Flex flexDirection="column" background={formBackground} rounded="10px" padding="30px">
            <Heading mb="10px">Log in</Heading>
            <VStack spacing="5px" align="stretch">
              <Input
                placeholder="example@email.com"
                variant="filled"
                type="email"
                borderWidth="1px"
              />
              <Input placeholder="******" variant="filled" type="password" />
              <Button colorScheme="teal">Log in</Button>
              <Button onClick={toggleColorMode}>Toggle mode</Button>
            </VStack>
          </Flex>
        </Flex>
      </main>
    </>
  );
}
