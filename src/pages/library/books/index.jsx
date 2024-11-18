import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Tag,
  Td,
  Text,
  Tr,
  Wrap,
  useDisclosure
} from '@chakra-ui/react';
import { LibraryPageLayout } from '@/components/Layouts';
import {
  borrowBook,
  deleteBook,
  returnBorrowedBook,
  searchBooks,
  searchBooksAsManager,
  viewBorrowedBooks,
  viewLibrary,
  viewLibraryAsManager
} from '@/services/api/queries/library';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAxiosErrorDetail, getOr } from '@/utils/objects';
import {
  bookSearch,
  clampText,
  formatDate,
  getDueStatusAndColor,
  getTagBadgeColorScheme,
  iff
} from '@/utils/helpers';
import { GiCrossMark } from 'react-icons/gi';
import { BookCard } from '@/components/Cards';
import { AddBookButton, FilterBooksButton } from '@/components/Buttons';
import { useState } from 'react';
import useUserRoles from '@/hooks/useUserRoles';
import GenreContextProvider from '@/contexts/GenreContextProvider';
import CreateEditBookModal from '@/components/Modals/CreateEditBookModal';
import TableListContainer from '@/components/Tables/TableListContainer';
import { get } from 'lodash';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import Link from 'next/link';
import { errorToast, successToast } from '@/utils/toast';
import ItemLayoutSwitchButton from '@/components/Buttons/ItemLayoutSwitchButton';

const Books = () => {
  const { isProprietor, isLibrarian, isBorrower } = useUserRoles();

  const [filters, setFilters] = useState({
    searchText: '',
    genres: []
  });
  const [isAllBooksQuery, setIsAllBooksQuery] = useState(true);
  const [tileView, setTileView] = useState(true);

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

  const { mutate: mutateBorrowBook, isPending: mutateBorrowBookIsPending } = useMutation({
    mutationFn: borrowBook,
    mutationKey: 'borrowBook',
    onSuccess: () => {
      refetch();
      successToast({ message: 'book borrowed' });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const { mutate: mutateReturnBorrowedBook, isPending: mutateReturnBorrowedBookIsPending } =
    useMutation({
      mutationFn: returnBorrowedBook,
      mutationKey: 'returnBorrowedBook',
      onSuccess: () => {
        refetch();
        successToast({ message: 'book returned' });
      },
      onError: (error) => {
        errorToast({ message: getAxiosErrorDetail(error) });
      }
    });

  const { mutate: mutateDeleteBook, isPending: mutateDeleteBookIsPending } = useMutation({
    mutationFn: deleteBook,
    mutationKey: 'deleteBook',
    onSuccess: () => {
      refetch();
      successToast({ message: 'book deleted' });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
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

  const handleOnClickEdit = (book) => {
    setSelectedEditBook(book);
    onOpen();
  };
  const cols = [
    {
      key: 'title',
      label: 'title',
      path: 'title',
      render: (book, title) => (
        <Link href={`/library/books/${book.id}`}>
          <Box
            as="span"
            _hover={{
              textDecorationLine: 'underline'
            }}>
            {title}
          </Box>
        </Link>
      )
    },
    {
      key: 'author_name',
      label: 'author name',
      path: 'author_name'
    },
    {
      key: 'description',
      label: 'description',
      path: 'description',
      render: (book, description) => clampText(description, 60)
    },
    {
      key: 'public_shelf_quantity',
      label: 'public shelf quantity',
      path: 'public_shelf_quantity'
    },
    {
      key: 'private_shelf_quantity',
      label: 'private shelf quantity',
      path: 'private_shelf_quantity',
      hide: isBorrower
    },
    {
      key: 'genres',
      label: 'genres',
      path: 'genre_associations',
      render: (book, genre_associations) => (
        <Wrap marginTop="auto" spacing={1}>
          {genre_associations
            .map((genreAssoc) => getOr(genreAssoc, 'genre.name'))
            .map((genreName) => (
              <Tag
                key={genreName}
                size="sm"
                textTransform="capitalize"
                colorScheme={getTagBadgeColorScheme(genreName)}>
                {genreName}
              </Tag>
            ))}
        </Wrap>
      )
    },
    {
      key: 'checked_out_at',
      label: 'borrowed at',
      path: 'borrowData.checked_out_at',
      render: (book, checked_out_at) => formatDate(checked_out_at),
      hide: isAllBooksQuery
    },
    {
      key: 'due_at',
      label: 'due at',
      path: 'borrowData.due_at',
      render: (book, due_at) => formatDate(due_at),
      hide: isAllBooksQuery
    },
    {
      key: 'actions',
      label: 'actions',
      path: null,
      render: (book) => (
        <ButtonGroup size="sm" fontSize="16px" justifyContent="end" marginTop="auto">
          {isBorrower ? (
            <Button
              variant="primary_action"
              onClick={() => {
                if (!isAllBooksQuery)
                  mutateReturnBorrowedBook({
                    id: book.borrow_id
                  });
                else
                  mutateBorrowBook({
                    book_id: book.id
                  });
              }}
              isLoading={mutateBorrowBookIsPending || mutateReturnBorrowedBookIsPending}
              fontSize="inherit">
              {!isAllBooksQuery ? 'Return' : 'Borrow'}
            </Button>
          ) : (
            ''
          )}
          {isProprietor ? (
            <>
              <IconButton
                variant="primary_action"
                icon={<MdModeEdit />}
                onClick={() => handleOnClickEdit(book)}
              />
              <IconButton
                variant="delete_action"
                onClick={() => mutateDeleteBook(book.id)}
                isLoading={mutateDeleteBookIsPending}
                icon={<MdDelete />}
              />
            </>
          ) : (
            ''
          )}
        </ButtonGroup>
      )
    }
  ];

  return (
    <LibraryPageLayout
      pageTitle="Books"
      filters={filters}
      setFilters={setFilters}
      showHeroSection
      isAllBooksQuery={isAllBooksQuery}
      onClickAddBook={onOpen}>
      <HStack justifyContent="space-between" marginBottom="10px">
        {isBorrower ? (
          <Flex gap="12px" marginBottom="10px">
            <FilterBooksButton isActive={isAllBooksQuery} onClick={() => setIsAllBooksQuery(true)}>
              All
            </FilterBooksButton>
            <FilterBooksButton
              isActive={!isAllBooksQuery}
              onClick={() => setIsAllBooksQuery(false)}>
              Borrowed
            </FilterBooksButton>
          </Flex>
        ) : (
          ''
        )}
        <ItemLayoutSwitchButton tileView={tileView} onClick={() => setTileView(!tileView)} />
      </HStack>
      {iff(
        viewLibraryIsLoading || isLoadingBorrowedBooks,
        <Center height="400px">
          <Spinner color="primary.500" />
        </Center>,
        iff(
          bookList.length === 0,
          <Center height="400px" textStyle="headline-5-medium" flexDirection="column">
            <GiCrossMark />
            <Text>No book found</Text>
          </Center>,
          tileView ? (
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
                      handleOnClickEdit(data);
                    }}
                    isBorrowView={!isAllBooksQuery}
                    isMutationRequestPending={
                      mutateBorrowBookIsPending ||
                      mutateReturnBorrowedBookIsPending ||
                      mutateDeleteBookIsPending
                    }
                    mutateBorrowBook={mutateBorrowBook}
                    mutateReturnBorrowedBook={mutateReturnBorrowedBook}
                    mutateDeleteBook={mutateDeleteBook}
                  />
                );
              })}
              {isProprietor ? <AddBookButton onClick={onOpen} /> : ''}
            </Wrap>
          ) : (
            <TableListContainer cols={cols.filter((col) => !col.hide)} width="100%">
              {bookList.map((data) => {
                const { color, status } = getDueStatusAndColor(
                  getOr(data, 'borrowData.due_at', null)
                );
                return (
                  <Tr key={data.id} borderLeftWidth={status ? '3px' : 0} borderColor={color}>
                    {cols
                      .filter((col) => !col.hide)
                      .map((col) => {
                        let element = get(data, col.path);
                        if (col.render) {
                          element = col.render(data, element);
                        }
                        return (
                          <Td
                            key={col.key}
                            textStyle="caption"
                            padding="20px 10px"
                            style={{
                              whiteSpace: 'normal',
                              wordWrap: 'break-word'
                            }}>
                            {element}
                          </Td>
                        );
                      })}
                  </Tr>
                );
              })}
            </TableListContainer>
          )
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
