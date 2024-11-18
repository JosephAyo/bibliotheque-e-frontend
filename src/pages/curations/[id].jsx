import {
  Center,
  Flex,
  Spinner,
  Text,
  Wrap,
  Button,
  Heading,
  Stack,
  ButtonGroup,
  Box
} from '@chakra-ui/react';
import { LibraryPageLayout } from '@/components/Layouts';
import { viewOneCuration } from '@/services/api/queries/curation';
import useUserRoles from '@/hooks/useUserRoles';
import GenreContextProvider from '@/contexts/GenreContextProvider';
import { useRouter } from 'next/router';
import { MdModeEdit } from 'react-icons/md';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOr } from '@/utils/objects';
import { BookCard } from '@/components/Cards';

const Curation = () => {
  const router = useRouter();

  const { isProprietor, isLibrarian, isBorrower } = useUserRoles();

  const {
    data,
    isLoading: viewCurationIsLoading,
  } = useQuery({
    placeholderData: {},
    enabled: !!router.query.id,
    queryKey: [`viewOneCuration`, router.query.id],
    queryFn: viewOneCuration,
    refetchOnWindowFocus: true,
    select: (queryResponse) => getOr(queryResponse, 'data', {})
  });

  const [_selectedEditCuration, setSelectedEditCuration] = useState(null);

  const { title, description, curation_associations } = data;

  const bookList = (curation_associations || []).map((assoc) => getOr(assoc, 'book', {}));

  return (
    <LibraryPageLayout pageTitle="Curations" filters={null} showHeroSection={false}>
      {viewCurationIsLoading ? (
        <Center height="400px">
          <Spinner color="primary.500" />
        </Center>
      ) : (
        <Stack spacing={2}>
          <Flex justifyContent="space-between">
            <Box>
              <Heading>{title}</Heading>
              <Text textStyle="headline-5-medium">{description}</Text>
            </Box>
            <ButtonGroup size="sm" fontSize="16px">
              {isLibrarian ? (
                <Button
                  variant="primary_action"
                  onClick={() => {
                    setSelectedEditCuration(data);
                  }}
                  rightIcon={<MdModeEdit />}>
                  Edit
                </Button>
              ) : (
                ''
              )}
            </ButtonGroup>
          </Flex>
          <Wrap spacing="18px">
            {bookList.map((book) => {
              const details = { ...book };
              if (!(isProprietor || isLibrarian)) delete details.private_shelf_quantity;
              delete details.public_shelf_quantity;
              return (
                <BookCard
                  key={book.id}
                  details={details}
                  isBorrower={isBorrower}
                  isProprietor={isProprietor}
                  isLibrarian={isLibrarian}
                  isBorrowView={false}
                />
              );
            })}
          </Wrap>
        </Stack>
      )}
      {/* <CreateEditCurationModal
          selectedCuration={selectedEditCuration}
          isOpen={!!selectedEditCuration}
          onClose={() => setSelectedEditCuration(null)}
          refetch={refetch}
        /> */}
    </LibraryPageLayout>
  );
};

const CurationPage = () => (
  <GenreContextProvider>
    <Curation />
  </GenreContextProvider>
);

export default CurationPage;
