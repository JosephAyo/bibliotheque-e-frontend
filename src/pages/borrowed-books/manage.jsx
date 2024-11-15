import { Text, Tr, Td, Wrap, IconButton, Tag, Box } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserAccountPageLayout } from '@/components/Layouts';
import { get } from 'lodash';
import { getAxiosErrorDetail, getAxiosResponseBody, getOr } from '@/utils/objects';
import { errorToast, successToast } from '@/utils/toast';
import { FaClock } from 'react-icons/fa';
import { DUE_STATUSES, USER_ROLES } from '@/utils/constants';
import { AuthorizationGate } from '@/components/Wrappers';
import TableListContainer from '@/components/Tables/TableListContainer';
import { viewBorrowedBooksAsManager } from '@/services/api/queries/library';
import {
  clampText,
  formatDate,
  getDueStatusAndColor,
  getGenreNameTagColorScheme,
  iff
} from '@/utils/helpers';
import Link from 'next/link';
import { Select } from 'chakra-react-select';
import { useState } from 'react';

const ManageBorrowedBooks = () => {
  const [filter, setFilter] = useState({
    value: 'all',
    label: 'All'
  });

  const { data, refetch } = useQuery({
    queryKey: ['viewBorrowedBooksAsManager', filter.value],
    queryFn: viewBorrowedBooksAsManager,
    refetchOnWindowFocus: true
  });

  const { mutate: mutateSendReminder, isPending: mutateSendReminderIsPending } = useMutation({
    mutationFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(`Promise resolved after ${3000} milliseconds`);
        }, 3000);
      }),
    mutationKey: 'editGenre',
    onSuccess: (response) => {
      successToast({ message: get(getAxiosResponseBody(response), 'detail', '') });
      refetch();
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const cols = [
    {
      key: 'title',
      label: 'Title',
      path: 'book.title',
      render: (borrowedBook, title) => (
        <Link href={`/library/books/${borrowedBook.book.id}`}>
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
      path: 'book.author_name'
    },
    {
      key: 'description',
      label: 'Description',
      path: 'book.description',
      render: (book, description) => clampText(description, 60)
    },
    {
      key: 'genres',
      label: 'genres',
      path: 'book.genre_associations',
      render: (borrowedBook, genre_associations) => (
        <Wrap marginTop="auto" spacing={1}>
          {genre_associations
            .map((genreAssoc) => getOr(genreAssoc, 'genre.name'))
            .map((genreAssocName) => (
              <Tag
                key={genreAssocName}
                size="sm"
                textTransform="capitalize"
                colorScheme={getGenreNameTagColorScheme(genreAssocName)}>
                {genreAssocName}
              </Tag>
            ))}
        </Wrap>
      )
    },
    {
      key: 'checked_out_at',
      label: 'borrowed at',
      path: 'checked_out_at',
      render: (borrowedBook, checked_out_at) => formatDate(checked_out_at)
    },
    {
      key: 'due_at',
      label: 'due at',
      path: 'due_at',
      render: (borrowedBook, due_at) => formatDate(due_at)
    },
    {
      key: 'status',
      label: 'status',
      path: 'due_at',
      render: (borrowedBook, due_at) => {
        const { returned } = borrowedBook;
        const { status, color: dueColor } = getDueStatusAndColor(due_at);
        return (
          <Tag
            colorScheme={returned || !dueColor ? 'green' : dueColor}
            variant="solid"
            textStyle="body"
            fontSize="sm">
            {returned
              ? 'returned'
              : iff(
                  status === DUE_STATUSES.DUE_SOON,
                  'due soon',
                  status === DUE_STATUSES.LATE ? 'late' : 'borrowed'
                )}
          </Tag>
        );
      }
    },
    {
      key: 'action',
      label: 'send reminder',
      path: null,
      render: (borrowedBook) => {
        const { returned } = borrowedBook;
        const { status } = getDueStatusAndColor(getOr(borrowedBook, 'due_at', null));

        return (
          <IconButton
            variant="primary_action"
            icon={<FaClock />}
            onClick={() => mutateSendReminder(borrowedBook.id)}
            isDisabled={returned || !status || mutateSendReminderIsPending}
          />
        );
      }
    }
  ];

  return (
    <UserAccountPageLayout pageTitle="Manage Genres">
      <Text textStyle="headline-5-medium" textTransform="uppercase">
        Borrowed books
      </Text>
      <Box alignSelf="flex-start">
        <Select
          placeholder="Filter by status"
          value={filter}
          onChange={(value) => setFilter(value)}
          options={[
            {
              value: 'all',
              label: 'All'
            },
            {
              value: 'due-soon',
              label: 'Due soon'
            },
            {
              value: 'late',
              label: 'Late'
            }
          ]}
        />
      </Box>
      <TableListContainer cols={cols}>
        {getOr(data, 'data', []).map((borrowedBook) => {
          const { returned } = borrowedBook;
          const { color, status } = getDueStatusAndColor(getOr(borrowedBook, 'due_at', null));
          return (
            <Tr
              key={borrowedBook.id}
              borderLeftWidth={!returned && status ? '3px' : 0}
              borderColor={!returned && color}>
              {cols.map((col) => {
                const isLateOrDue = false;
                let element = get(borrowedBook, col.path);
                if (col.render) {
                  if (col.key === 'action') element = col.render(borrowedBook, isLateOrDue);
                  else element = col.render(borrowedBook, get(borrowedBook, col.path));
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
      <Box height="20px" />
    </UserAccountPageLayout>
  );
};

const ManageBorrowedBooksComponent = () => (
  <AuthorizationGate permittedRoles={[USER_ROLES.LIBRARIAN]}>
    <ManageBorrowedBooks />
  </AuthorizationGate>
);

export default ManageBorrowedBooksComponent;
