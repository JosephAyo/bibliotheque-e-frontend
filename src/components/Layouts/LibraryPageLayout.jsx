import Head from 'next/head';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { SearchInputField } from 'components/Inputs';
import { BiSolidSearchAlt2 } from 'react-icons/bi';

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
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="893px"
        marginLeft="auto"
        marginRight="auto"
        paddingY="48px"
        paddingX="23px">
        <Flex gap="8px" marginBottom="16px" width="100%">
          <SearchInputField
            containerProps={{ flex: 1 }}
            inputFieldProps={{
              placeholder: 'Search'
            }}
          />
          <IconButton variant="primary_action" icon={<BiSolidSearchAlt2 />} />
        </Flex>
        <Box>{children}</Box>
      </Flex>
    </main>
  </>
);

export default LibraryPageLayout;
