import {
  Button,
  Text,
  Tr,
  Td,
  Flex,
  Heading,
  Box,
  IconButton,
  Wrap,
  Badge,
  VStack
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { UserAccountPageLayout } from '@/components/Layouts';
import { get } from 'lodash';
import { useState } from 'react';
import { viewCurations } from '@/services/api/queries/curation';
import { getOr } from '@/utils/objects';
import { USER_ROLES } from '@/utils/constants';
import { AuthorizationGate } from '@/components/Wrappers';
import { IoMdAddCircle } from 'react-icons/io';
import TableListContainer from '@/components/Tables/TableListContainer';
import curationTableAndEditorLayout from '@/components/TableDataLayout/curation';
import CreateEditCurationModal from '@/components/Modals/CreateEditCurationModal';
import useUserRoles from '@/hooks/useUserRoles';
import ItemLayoutSwitchButton from '@/components/Buttons/ItemLayoutSwitchButton';
import { getTagBadgeColorScheme, iff } from '@/utils/helpers';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';

const ManageCurations = () => {
  const [selectedCuration, setSelectedCuration] = useState(null);
  const { currentUserRoleName, isLibrarian } = useUserRoles();
  const [tileView, setTileView] = useState(true);

  const { data, refetch } = useQuery({
    queryKey: ['viewCurations'],
    queryFn: viewCurations,
    refetchOnWindowFocus: true,
    placeholderData: [],
    select: (queryResponse) => {
      const curations = getOr(queryResponse, 'data', []);
      return curations.map((curation) => ({
        ...curation,
        book_ids: getOr(curation, 'curation_associations', []).map((assoc) => {
          const book = getOr(assoc, 'book', {});
          return {
            value: book.id,
            label: `${book.title} | ${book.author_name}`
          };
        })
      }));
    }
  });

  const filteredCols = curationTableAndEditorLayout.filter((col) =>
    col.allowedRoles
      ? !col.hideInTable && col.allowedRoles.includes(currentUserRoleName)
      : !col.hideInTable
  );

  const displayedBooksLimit = 5;

  return (
    <UserAccountPageLayout pageTitle="Manage Curations">
      <Text textStyle="headline-5-medium" textTransform="uppercase">
        Curations
      </Text>
      {isLibrarian ? (
        <Flex width="100%" justifyContent="flex-end">
          <Button
            variant="primary_action"
            rightIcon={<IoMdAddCircle />}
            onClick={() =>
              setSelectedCuration({
                title: '',
                description: '',
                published: false,
                genre_ids: []
              })
            }>
            Add
          </Button>
        </Flex>
      ) : (
        ''
      )}
      {isLibrarian ? (
        <ItemLayoutSwitchButton tileView={tileView} onClick={() => setTileView(!tileView)} />
      ) : (
        ''
      )}
      {iff(
        tileView,
        (data || []).map((curation) => (
          <Flex key={curation.id} justifyContent="space-between" width="100%" alignItems="center">
            <VStack gap="10px" alignItems="flex-start">
              <Link href={`/curations/${curation.id}`}>
                <Box
                  as="span"
                  _hover={{
                    textDecorationLine: 'underline'
                  }}>
                  <Heading>{curation.title}</Heading>
                  <Text textStyle="headline-5-medium">{curation.description}</Text>
                </Box>
              </Link>
              <Wrap spacing="5px">
                <Text textStyle="caption">Books:</Text>
                {getOr(curation, 'curation_associations', [])
                  .slice(0, displayedBooksLimit)
                  .map((assoc) => (
                    <Badge
                      key={assoc.id}
                      paddingBottom={0}
                      colorScheme={getTagBadgeColorScheme(
                        assoc.book.title + assoc.book.author_name
                      )}>
                      {assoc.book.title} | {assoc.book.author_name}
                    </Badge>
                  ))}
                {getOr(curation, 'curation_associations', []).length > displayedBooksLimit
                  ? '...'
                  : ''}
              </Wrap>
            </VStack>
            {isLibrarian ? (
              <IconButton
                variant="primary_action"
                icon={<FaEdit />}
                onClick={() => setSelectedCuration(curation)}
              />
            ) : (
              ''
            )}
          </Flex>
        )),
        <TableListContainer cols={filteredCols}>
          {(data || []).map((curation) => (
            <Tr key={curation.id}>
              {filteredCols.map((col) => {
                const onClickHandler = () => {
                  setSelectedCuration({
                    ...curation
                  });
                };
                let element = get(curation, col.path);
                if (col.render) {
                  if (col.key === 'action') element = col.render(curation, onClickHandler);
                  else element = col.render(curation, get(curation, col.path));
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
          ))}
        </TableListContainer>
      )}
      {selectedCuration ? (
        <CreateEditCurationModal
          selectedCuration={selectedCuration}
          isOpen
          onClose={() => setSelectedCuration(null)}
          refetch={refetch}
        />
      ) : (
        ''
      )}
    </UserAccountPageLayout>
  );
};

const ManageCurationsComponent = () => (
  <AuthorizationGate
    permittedRoles={[USER_ROLES.BORROWER, USER_ROLES.PROPRIETOR, USER_ROLES.LIBRARIAN]}>
    <ManageCurations />
  </AuthorizationGate>
);

export default ManageCurationsComponent;
