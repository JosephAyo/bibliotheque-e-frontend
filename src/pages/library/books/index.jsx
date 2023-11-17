import { Flex, IconButton, Wrap } from '@chakra-ui/react';
import BookCard from 'components/Cards/BookCard';
import { LibraryPageLayout } from 'components/Layouts';
import { SearchInputField } from 'components/Inputs';
import { BiSolidSearchAlt2 } from 'react-icons/bi';

const Books = () => (
  <LibraryPageLayout
    pageTitle="Book"
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
    }
    >
    <Wrap spacing="18px">
      {[
        {
          id: 55
        },
        {
          id: 22
        },
        {
          id: 86
        },
        {
          id: 54
        },
        {
          id: 463
        },
        {
          id: 26767
        },
        {
          id: 57332
        },
        {
          id: 3226
        },
        {
          id: 786
        },
        {
          id: 906
        },
        {
          id: 691
        },
        {
          id: 576
        },
        {
          id: 66789
        },
        {
          id: 2221
        },
        {
          id: 778
        },
        {
          id: 4211
        },
        {
          id: 454
        }
      ].map((data) => (
        <BookCard key={data.id} />
      ))}
    </Wrap>
  </LibraryPageLayout>
);

export default Books;
