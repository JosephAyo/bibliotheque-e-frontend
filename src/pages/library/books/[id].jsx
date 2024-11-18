import {
  Center,
  Flex,
  Spinner,
  Text,
  Wrap,
  Button,
  VStack,
  Image,
  Heading,
  Stack,
  Tag,
  Skeleton,
  ButtonGroup
} from '@chakra-ui/react';
import { LibraryPageLayout } from '@/components/Layouts';
import { borrowBook, deleteBook, viewOneBook } from '@/services/api/queries/library';
import useUserRoles from '@/hooks/useUserRoles';
import GenreContextProvider from '@/contexts/GenreContextProvider';
import { useRouter } from 'next/router';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAxiosErrorDetail, getOr } from '@/utils/objects';
import { getTagBadgeColorScheme } from '@/utils/helpers';
import { errorToast, successToast } from '@/utils/toast';
import CreateEditBookModal from '@/components/Modals/CreateEditBookModal';

const Book = () => {
  const router = useRouter();

  const { isProprietor, isLibrarian, isBorrower } = useUserRoles();

  const [imageReady, setImageReady] = useState(false);

  const {
    data,
    isLoading: viewBookIsLoading,
    refetch
  } = useQuery({
    placeholderData: {},
    enabled: !!router.query.id,
    queryKey: [`viewOneBook`, router.query.id],
    queryFn: viewOneBook,
    refetchOnWindowFocus: true,
    select: (queryResponse) => getOr(queryResponse, 'data', {})
  });

  const [selectedEditBook, setSelectedEditBook] = useState(null);

  const {
    id,
    title,
    author_name,
    description,
    public_shelf_quantity,
    private_shelf_quantity,
    current_borrow_count,
    img_url
  } = data;

  const genreNames = getOr(data, 'genre_associations', []).map((genreAssoc) =>
    getOr(genreAssoc, 'genre.name')
  );

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

  const { mutate: mutateDeleteBook, isPending: mutateDeleteBookIsPending } = useMutation({
    mutationFn: deleteBook,
    mutationKey: 'deleteBook',
    onSuccess: () => {
      successToast({ message: 'book deleted' });
      router.replace('/library/books');
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  return (
    <LibraryPageLayout pageTitle="Books" filters={null} showHeroSection={false}>
      {viewBookIsLoading ? (
        <Center height="400px">
          <Spinner color="primary.500" />
        </Center>
      ) : (
        <Flex justifyContent="space-between" marginTop="20px">
          <Stack spacing={2} width="fit-content" marginRight="40px">
            <Heading>{title}</Heading>
            <Text textStyle="headline-5-medium">{author_name}</Text>
            <Wrap spacing={1}>
              {genreNames.map((genreName) => (
                <Tag
                  key={genreName}
                  size="sm"
                  textTransform="capitalize"
                  colorScheme={getTagBadgeColorScheme(genreName)}>
                  {genreName}
                </Tag>
              ))}
            </Wrap>
            <Text>{description}</Text>
            <VStack spacing="2px" alignItems="flex-start">
              {Number.isNaN(parseFloat(current_borrow_count)) ? (
                ''
              ) : (
                <Text textStyle="caption">
                  Borrowed:&nbsp;
                  {new Intl.NumberFormat(undefined, {
                    notation: 'compact'
                  }).format(current_borrow_count)}
                </Text>
              )}
              {Number.isNaN(parseFloat(public_shelf_quantity)) ? (
                ''
              ) : (
                <Text textStyle="caption">
                  {isProprietor || isLibrarian ? 'Public shelf' : 'Total'}
                  :&nbsp;
                  {new Intl.NumberFormat(undefined, {
                    notation: 'compact'
                  }).format(public_shelf_quantity)}
                </Text>
              )}
              {Number.isNaN(parseFloat(private_shelf_quantity)) ? (
                ''
              ) : (
                <Text textStyle="caption">
                  Private shelf:&nbsp;
                  {new Intl.NumberFormat(undefined, {
                    notation: 'compact'
                  }).format(private_shelf_quantity)}
                </Text>
              )}
            </VStack>
            <ButtonGroup size="sm" fontSize="16px" marginLeft="auto">
              {isBorrower ? (
                <Button
                  variant="primary_action"
                  onClick={() => {
                    mutateBorrowBook({
                      book_id: id
                    });
                  }}
                  isLoading={mutateBorrowBookIsPending}
                  fontSize="inherit">
                  Borrow
                </Button>
              ) : (
                ''
              )}
              {isProprietor ? (
                <>
                  <Button
                    variant="primary_action"
                    onClick={() => {
                      setSelectedEditBook(data);
                    }}
                    rightIcon={<MdModeEdit />}>
                    Edit
                  </Button>
                  <Button
                    variant="delete_action"
                    onClick={() => mutateDeleteBook(id)}
                    isLoading={mutateDeleteBookIsPending}
                    rightIcon={<MdDelete />}>
                    Delete
                  </Button>
                </>
              ) : (
                ''
              )}
            </ButtonGroup>
          </Stack>
          <Stack position="relative" spacing={2}>
            <Skeleton isLoaded={imageReady} width="350px" height="500px">
              <Image
                src={img_url}
                alt={`${title} image`}
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '2px',
                  height: '100%',
                  width: '100%',
                  opacity: imageReady ? 1 : 0
                }}
                onLoad={() => setImageReady(true)}
              />
            </Skeleton>
          </Stack>
        </Flex>
      )}
      <CreateEditBookModal
        selectedBook={selectedEditBook}
        isOpen={!!selectedEditBook}
        onClose={() => setSelectedEditBook(null)}
        refetch={refetch}
      />
    </LibraryPageLayout>
  );
};

const BookPage = ({ children }) => (
  <GenreContextProvider>
    <Book>{children}</Book>
  </GenreContextProvider>
);

export default BookPage;
