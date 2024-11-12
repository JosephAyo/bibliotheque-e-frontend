import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  Text,
  VStack,
  Wrap,
  useColorModeValue
} from '@chakra-ui/react';
import { PiBooksDuotone } from 'react-icons/pi';
import { borrowBook, deleteBook, returnBorrowedBook } from '@/services/api/queries/library';
import { errorToast, successToast } from '@/utils/toast';
import { getAxiosErrorDetail, getOr } from '@/utils/objects';
import { useMutation } from '@tanstack/react-query';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { LuBookUp } from 'react-icons/lu';
import { IconBookQuantity } from '@/components/DataDisplay';
import { TbBooksOff } from 'react-icons/tb';
import {
  getDueStatus,
  formatDate,
  getGenreNameTagColorScheme,
  getDueStatusAndColor
} from '@/utils/helpers';
import Link from 'next/link';
import CopyLinkButton from '../Buttons/CopyLinkButton';

const BookCard = ({
  details,
  isLibrarian,
  isBorrower,
  isProprietor,
  refetch,
  onClickEditBook,
  isBorrowView
}) => {
  const cardBackgroundColor = useColorModeValue('#f6f6f6', 'gray.600');
  const authorColor = useColorModeValue('#999', '#BBB');
  const {
    id,
    title,
    author_name,
    description,
    public_shelf_quantity,
    private_shelf_quantity,
    current_borrow_count,
    img_url,
    borrowData,
    genre_associations
  } = details;

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

  const checked_out_at = getOr(borrowData, 'checked_out_at', null);
  const due_at = getOr(borrowData, 'due_at', null);

  const genreNames = genre_associations.map((genreAssoc) => getOr(genreAssoc, 'genre.name'));

  const { status: dueStatus, color: dueColor } = getDueStatusAndColor(due_at);
  return (
    <Popover placement="right-start">
      <PopoverTrigger>
        <Box
          width="155px"
          height="220px"
          backgroundColor={cardBackgroundColor}
          borderRadius="18px"
          cursor="pointer"
          {...(isBorrowView && {
            borderWidth: dueStatus ? '3px' : 0,
            borderColor: dueColor
          })}>
          <Box position="relative">
            <Image
              src={img_url}
              alt="book img"
              fill
              style={{
                objectFit: 'cover',
                borderRadius: '16px 16px 0 0',
                height: '144px',
                width: '100%'
              }}
            />
          </Box>
          <VStack
            marginTop="9px"
            padding="12px"
            paddingTop="0px"
            spacing="8px"
            width="100%"
            alignItems="flex-start">
            <Flex gap="8px" flexDirection="column">
              <Text textStyle="subtitle-1" noOfLines={1}>
                {title}
              </Text>
              <Text textStyle="subtitle-2-medium" noOfLines={1} color={authorColor}>
                {author_name}
              </Text>
            </Flex>
            <Flex width="100%" justifyContent="space-between" alignItems="end">
              <Flex flex={1} justifyContent="space-between">
                <IconBookQuantity quantity={current_borrow_count} icon={<LuBookUp size={12} />} />
                <IconBookQuantity
                  quantity={public_shelf_quantity}
                  icon={<PiBooksDuotone size={14} />}
                />
              </Flex>
              <IconBookQuantity
                containerProps={{
                  flex: 2,
                  justifyContent: 'flex-end'
                }}
                quantity={private_shelf_quantity}
                icon={<TbBooksOff size={14} />}
              />
            </Flex>
          </VStack>
        </Box>
      </PopoverTrigger>
      <PopoverContent backgroundColor={cardBackgroundColor} width="400px">
        <PopoverArrow backgroundColor={cardBackgroundColor} />
        <PopoverCloseButton />
        <PopoverHeader
          _hover={{
            textDecorationLine: 'underline'
          }}>
          <HStack marginRight="20px">
            <Link href={`/library/books/${id}`}>
              <strong>
                {title}
                {title}
              </strong>{' '}
              <br />
              <Text textStyle="subtitle-1-medium">{author_name}</Text>
            </Link>
            <CopyLinkButton link={`${window.location.origin}/library/books/${id}`} />
          </HStack>
        </PopoverHeader>
        <PopoverBody
          minH="200px"
          maxHeight="400px"
          overflowY="scroll"
          display="flex"
          flexDir="column"
          gap={5}
          sx={{
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#000000aa',
              borderRadius: '24px'
            },
            '&': {
              scrollbarWidth: 'thin',
              scrollbarColor: '#000000aa transparent'
            }
          }}>
          <Text>{description}</Text>
          <Wrap marginTop="auto" spacing={1}>
            {genreNames.map((genreName) => (
              <Tag
                key={genreName}
                size="sm"
                textTransform="capitalize"
                colorScheme={getGenreNameTagColorScheme(genreName)}>
                {genreName}
              </Tag>
            ))}
          </Wrap>
        </PopoverBody>
        <PopoverFooter display="flex" alignItems="center" justifyContent="space-between">
          <VStack spacing="2px" alignItems="flex-start">
            {Number.isNaN(parseFloat(current_borrow_count)) ? (
              ''
            ) : (
              <Text textStyle="subtitle-1">
                Borrowed:&nbsp;
                {new Intl.NumberFormat(undefined, {
                  notation: 'compact'
                }).format(current_borrow_count)}
              </Text>
            )}
            {Number.isNaN(parseFloat(public_shelf_quantity)) ? (
              ''
            ) : (
              <Text textStyle="subtitle-1">
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
              <Text textStyle="subtitle-1">
                Private shelf:&nbsp;
                {new Intl.NumberFormat(undefined, {
                  notation: 'compact'
                }).format(private_shelf_quantity)}
              </Text>
            )}
            {isBorrowView ? (
              <>
                {checked_out_at ? (
                  <Text textStyle="subtitle-1">
                    Borrowed at:&nbsp;
                    {formatDate(checked_out_at)}
                  </Text>
                ) : (
                  ''
                )}
                {due_at ? (
                  <Text textStyle="subtitle-1" color={getDueStatus(due_at)}>
                    Due at:&nbsp;
                    {formatDate(due_at)}
                  </Text>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </VStack>
          <ButtonGroup size="sm" fontSize="16px" justifyContent="end" marginTop="auto">
            {isBorrower ? (
              <Button
                variant="primary_action"
                onClick={() => {
                  if (isBorrowView)
                    mutateReturnBorrowedBook({
                      id: details.borrow_id
                    });
                  else
                    mutateBorrowBook({
                      book_id: details.id
                    });
                }}
                isLoading={mutateBorrowBookIsPending || mutateReturnBorrowedBookIsPending}
                fontSize="inherit">
                {isBorrowView ? 'Return' : 'Borrow'}
              </Button>
            ) : (
              ''
            )}
            {isProprietor ? (
              <>
                <IconButton
                  variant="primary_action"
                  onClick={onClickEditBook}
                  icon={<MdModeEdit />}
                />
                <IconButton
                  variant="delete_action"
                  onClick={() => mutateDeleteBook(details.id)}
                  isLoading={mutateDeleteBookIsPending}
                  icon={<MdDelete />}
                />
              </>
            ) : (
              ''
            )}
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default BookCard;
