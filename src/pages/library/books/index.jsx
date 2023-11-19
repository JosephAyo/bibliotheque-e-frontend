import { Flex, IconButton, Wrap } from '@chakra-ui/react';
import BookCard from 'components/Cards/BookCard';
import { LibraryPageLayout } from 'components/Layouts';
import { SearchInputField } from 'components/Inputs';
import { BiSolidSearchAlt2 } from 'react-icons/bi';
import { viewLibrary } from 'services/api/queries/library';
import { useQuery } from '@tanstack/react-query';
import { getOr } from 'utils/objects';

const Books = () => {
  const { data: viewLibraryResponse } = useQuery({
    queryKey: ['viewLibrary'],
    queryFn: viewLibrary,
    refetchOnWindowFocus: true
  });

  return (
    <LibraryPageLayout
      pageTitle="Books"
      searchBar={
        <Flex flex={1} gap="10px">
          <SearchInputField
            containerProps={{ flex: 1 }}
            inputFieldProps={{
              placeholder: 'Search'
            }}
          />
          <IconButton variant="primary_action_themed" icon={<BiSolidSearchAlt2 />} />
        </Flex>
      }>
      <Wrap spacing="18px">
        {getOr(viewLibraryResponse, 'data', []).map((data) => (
          <BookCard key={data.id} {...data} />
        ))}
      </Wrap>
    </LibraryPageLayout>
  );
};

export default Books;
