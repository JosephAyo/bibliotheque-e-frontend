import { Center, Flex, Spinner, Text, Wrap, useDisclosure } from '@chakra-ui/react';
import { LibraryPageLayout } from '@/components/Layouts';
import {
  searchBooks,
  searchBooksAsManager,
  viewBorrowedBooks,
  viewLibrary,
  viewLibraryAsManager
} from '@/services/api/queries/library';
import { useQuery } from '@tanstack/react-query';
import { getOr } from '@/utils/objects';
import { bookSearch, iff } from '@/utils/helpers';
import { GiCrossMark } from 'react-icons/gi';
import { BookCard } from '@/components/Cards';
import { AddBookButton, FilterBooksButton } from '@/components/Buttons';
import { useState } from 'react';
import useUserRoles from '@/hooks/useUserRoles';
import GenreContextProvider from '@/contexts/GenreContextProvider';
import CreateEditBookModal from '@/components/Modals/CreateEditBookModal';

const Books = () => {
  const { isProprietor, isLibrarian, isBorrower } = useUserRoles();

  const [filters, setFilters] = useState({
    searchText: '',
    genres: []
  });
  const [isAllBooksQuery, setIsAllBooksQuery] = useState(true);

  const {
    data: viewLibraryResponse,
    isLoading: viewLibraryIsLoading,
    refetch
  } = useQuery({
    enabled: isAllBooksQuery,
    queryKey: [
      `viewLibrary|${isProprietor}|${isLibrarian}|${isAllBooksQuery}|${JSON.stringify(filters)}`,
      filters
    ],
    queryFn: iff(
      isProprietor || isLibrarian,
      filters.searchText ? viewLibraryAsManager : searchBooksAsManager,
      filters.searchText ? searchBooks : viewLibrary
    ),
    refetchOnWindowFocus: true,
    select: (queryResponse) => {
      const books = getOr(queryResponse, 'data', []);
      return {
        ...queryResponse,
        data: books
      };
    }
  });

  const {
    data: viewBorrowedBooksResponse,
    isLoading: isLoadingBorrowedBooks,
    refetch: refetchBorrowedBooks
  } = useQuery({
    enabled: isBorrower && !isAllBooksQuery,
    queryKey: ['viewBorrowedBooks', isBorrower, isAllBooksQuery],
    queryFn: viewBorrowedBooks,
    refetchOnWindowFocus: true,
    select: (queryResponse) => {
      const books = getOr(queryResponse, 'data', [])
        .filter((book) => !book.returned)
        .map((borrowData) => ({
          borrowData,
          borrow_id: borrowData.id,
          ...borrowData.book
        }));
      return {
        ...queryResponse,
        data: filters.searchText ? bookSearch(books, filters.searchText) : books
      };
    }
  });

  const [selectedEditBook, setSelectedEditBook] = useState(null);

  const bookList = getOr(
    isAllBooksQuery ? viewLibraryResponse : viewBorrowedBooksResponse,
    'data',
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModalClose = () => {
    setSelectedEditBook(null);
    onClose();
  };

  const handleRefetch = () => {
    refetch();
    if (isBorrower && !isAllBooksQuery) refetchBorrowedBooks();
  };

  return (
    <LibraryPageLayout
      pageTitle="Books"
      filters={filters}
      setFilters={setFilters}
      showHeroSection
      isAllBooksQuery={isAllBooksQuery}
      onClickAddBook={onOpen}>
      {isBorrower ? (
        <Flex gap="12px" marginBottom="10px">
          <FilterBooksButton isActive={isAllBooksQuery} onClick={() => setIsAllBooksQuery(true)}>
            All
          </FilterBooksButton>
          <FilterBooksButton isActive={!isAllBooksQuery} onClick={() => setIsAllBooksQuery(false)}>
            Borrowed
          </FilterBooksButton>
        </Flex>
      ) : (
        ''
      )}
      {iff(
        viewLibraryIsLoading || isLoadingBorrowedBooks,
        <Center height="400px">
          <Spinner color="primary.500" />
        </Center>,
        bookList.length === 0 ? (
          <Center height="400px" textStyle="headline-5-medium" flexDirection="column">
            <GiCrossMark />
            <Text>No book found</Text>
          </Center>
        ) : (
          <Wrap spacing="18px">
            {bookList.map((data) => {
              const details = { ...data };
              if (!isProprietor) delete details.private_shelf_quantity;
              if (!isAllBooksQuery) delete details.public_shelf_quantity;
              return (
                <BookCard
                  key={data.id}
                  details={details}
                  isBorrower={isBorrower}
                  isProprietor={isProprietor}
                  isLibrarian={isLibrarian}
                  refetch={handleRefetch}
                  onClickEditBook={() => {
                    setSelectedEditBook(data);
                    onOpen();
                  }}
                  isBorrowView={!isAllBooksQuery}
                />
              );
            })}
            {isProprietor ? <AddBookButton onClick={onOpen} /> : ''}
          </Wrap>
        )
      )}

      <CreateEditBookModal
        selectedBook={selectedEditBook}
        isOpen={isOpen}
        onClose={handleModalClose}
        refetch={handleRefetch}
      />
    </LibraryPageLayout>
  );
};

const BooksPage = ({ children }) => (
  <GenreContextProvider>
    <Books>{children}</Books>
  </GenreContextProvider>
);

export default BooksPage;
