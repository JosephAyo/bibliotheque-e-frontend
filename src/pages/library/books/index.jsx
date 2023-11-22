import { Center, Flex, IconButton, Spinner, Text, Wrap } from '@chakra-ui/react';
import { LibraryPageLayout } from 'components/Layouts';
import { SearchInputField } from 'components/Inputs';
import { BiSolidSearchAlt2 } from 'react-icons/bi';
import { viewLibrary } from 'services/api/queries/library';
import { useQuery } from '@tanstack/react-query';
import { getOr } from 'utils/objects';
import { iff } from 'utils/helpers';
import { GiCrossMark } from 'react-icons/gi';
import { BookCard } from 'components/Cards';

const Books = () => {
  const { data: viewLibraryResponse, isLoading } = useQuery({
    queryKey: ['viewLibrary'],
    queryFn: viewLibrary,
    refetchOnWindowFocus: true
  });

  const libraryBooks = getOr(viewLibraryResponse, 'data', []);
  return (
    <LibraryPageLayout
      pageTitle="Books"
      searchBar={
        <Flex width="420px" gap="10px">
          <SearchInputField
            containerProps={{ flex: 1 }}
            inputFieldProps={{
              placeholder: 'Search'
            }}
          />
          <IconButton variant="primary_action" icon={<BiSolidSearchAlt2 />} />
        </Flex>
      }
      showHeroSection>
      {iff(
        isLoading,
        <Center height="400px">
          <Spinner color="primary.500" />
        </Center>,
        libraryBooks.length === 0 ? (
          <Center height="400px" textStyle="headline-5-medium" flexDirection="column">
            <GiCrossMark />
            <Text>No book found</Text>
          </Center>
        ) : (
          <Wrap spacing="18px">
            {getOr(viewLibraryResponse, 'data', []).map((data) => (
              <BookCard key={data.id} {...data} />
            ))}
          </Wrap>
        )
      )}
    </LibraryPageLayout>
  );
};

export default Books;
