import Head from 'next/head';
import { Box, ButtonGroup, Center, Flex, IconButton, Text } from '@chakra-ui/react';
import { ThemeToggleButton } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/UserMenu';
import { LibrarianMenu } from '@/components/LibrarianMenu';
import MainContentContainer from './MainContentContainer';
import { UserAuthWrapper } from '@/components/Wrappers';
import { HeadTitle } from '@/components/Head';
import { BsBookHalf } from 'react-icons/bs';
import Link from 'next/link';
import bgImage from '../../../public/assets/hero-section-bg.jpg';
import useUserRoles from '@/hooks/useUserRoles';
import useGenreContext from '@/hooks/useGenreContext';
import { Select } from 'chakra-react-select';
import { SearchInputField } from '../Inputs';
import { BiSolidSearchAlt2 } from 'react-icons/bi';

const LibraryPageLayout = ({ children, pageTitle, showHeroSection, filters, setFilters }) => {
  const { isLibrarian } = useUserRoles();
  const genres = useGenreContext();

  return (
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
            {showHeroSection ? (
              <Box width="100%">
                <Flex alignItems="center">
                  <Link href="/library/books">
                    <Flex alignItems="center">
                      <BsBookHalf size={26} />
                      <Text textStyle="headline-5-medium" marginLeft="4px">
                        Bibliotheque-E
                      </Text>
                    </Flex>
                  </Link>
                  <ButtonGroup
                    marginLeft="auto"
                    spacing="15px"
                    width="155px"
                    justifyContent="flex-end">
                    <UserMenu />
                    {isLibrarian ? <LibrarianMenu /> : ''}
                    <ThemeToggleButton />
                  </ButtonGroup>
                </Flex>
                <Box
                  width="100%"
                  height="204px"
                  marginTop="27px"
                  borderRadius="25px"
                  backgroundImage={`url(${bgImage.src})`}
                  backgroundPosition="center"
                  backgroundSize="cover"
                  position="relative"
                  sx={{
                    '&:before': {
                      content: "''",
                      zIndex: 1,
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background: '#000000',
                      opacity: 0.6,
                      borderRadius: '25px'
                    }
                  }}>
                  <Center height="100%" zIndex={2} flexDirection="column" position="inherit">
                    <Text textStyle="headline-4-medium" color="white" marginBottom="25px">
                      Unleash Your Inner&nbsp;
                      <Box as="span" color="primary.default">
                        Bibliophile
                      </Box>
                    </Text>
                    <Flex width="420px" gap="10px">
                      <SearchInputField
                        containerProps={{ flex: 1 }}
                        value={filters}
                        inputFieldProps={{
                          placeholder: 'Search',
                          onChange: (e) => setFilters({ ...filters, searchText: e.target.value })
                        }}
                      />
                      <IconButton variant="primary_action" icon={<BiSolidSearchAlt2 />} />
                    </Flex>
                  </Center>
                </Box>
              </Box>
            ) : (
              ''
            )}
            <Box alignSelf="flex-start">
              <Select
                isMulti
                placeholder="Filter by genres"
                value={filters.genres}
                onChange={(value) => setFilters((prevValue) => ({ ...prevValue, genres: value }))}
                options={genres}
              />
            </Box>
            <Box minHeight="80vh" width="100%" sx={{ '&>div': { width: '100%' } }} marginTop="10px">
              {children}
            </Box>
          </MainContentContainer>
        </UserAuthWrapper>
      </main>
    </>
  );
};

export default LibraryPageLayout;
