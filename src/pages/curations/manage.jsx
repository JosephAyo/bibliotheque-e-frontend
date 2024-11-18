import { Button, Text, Tr, Td, Flex } from '@chakra-ui/react';
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

const ManageCurations = () => {
  const [selectedCuration, setSelectedCuration] = useState(null);

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

  return (
    <UserAccountPageLayout pageTitle="Manage Curations">
      <Text textStyle="headline-5-medium" textTransform="uppercase">
        Curations
      </Text>
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
      <TableListContainer cols={curationTableAndEditorLayout.filter((col) => !col.hideInTable)}>
        {(data || []).map((curation) => (
          <Tr key={curation.id}>
            {curationTableAndEditorLayout
              .filter((col) => !col.hideInTable)
              .map((col) => {
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
  <AuthorizationGate permittedRoles={[USER_ROLES.LIBRARIAN]}>
    <ManageCurations />
  </AuthorizationGate>
);

export default ManageCurationsComponent;
