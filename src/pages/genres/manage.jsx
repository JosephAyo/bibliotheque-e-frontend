import {
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Wrap,
  IconButton,
  Flex
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserAccountPageLayout } from '@/components/Layouts';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import { useState } from 'react';
import { viewGenres, editGenre, createGenre } from '@/services/api/queries/genre';
import { getAxiosErrorDetail, getAxiosResponseBody, getOr } from '@/utils/objects';
import { errorToast, successToast } from '@/utils/toast';
import * as yup from 'yup';
import { FaEdit } from 'react-icons/fa';
import { USER_ROLES } from '@/utils/constants';
import useAppStore from '@/lib/store';
import { AuthorizationGate } from '@/components/Wrappers';
import { FormInputField } from '@/components/Inputs';
import { IoMdAddCircle } from 'react-icons/io';

const ManageGenres = () => {
  const {
    userSlice: { currentUser }
  } = useAppStore();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required()
  });

  const { data, refetch } = useQuery({
    queryKey: ['viewGenres'],
    queryFn: viewGenres,
    refetchOnWindowFocus: true
  });

  const { mutate: mutateEditGenre, isPending: mutateEditGenreIsPending } = useMutation({
    mutationFn: editGenre,
    mutationKey: 'editGenre',
    onSuccess: (response) => {
      successToast({ message: get(getAxiosResponseBody(response), 'detail', '') });
      refetch();
      setSelectedGenre(null);
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const { mutate: mutateCreateGenre, isPending: mutateCreateGenreIsPending } = useMutation({
    mutationFn: createGenre,
    mutationKey: 'createGenre',
    onSuccess: (response) => {
      successToast({ message: get(getAxiosResponseBody(response), 'detail', '') });
      refetch();
      setSelectedGenre(null);
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const cols = [
    {
      key: 'name',
      label: 'Name',
      path: 'name',
      editable: true
    },
    {
      key: 'description',
      label: 'Description',
      path: 'description',
      editable: true
    },
    {
      key: 'created_at',
      label: 'Created',
      path: 'created_at',
      render: (date) =>
        new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }).format(new Date(date))
    },
    {
      key: 'updated_at',
      label: 'Updated',
      path: 'updated_at',
      render: (date) =>
        new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }).format(new Date(date))
    },
    {
      key: 'action',
      label: 'action',
      path: null,
      render: (onClickHandler, isDisabled) => (
        <IconButton
          variant="primary_action"
          icon={<FaEdit />}
          onClick={() => onClickHandler()}
          isDisabled={isDisabled}
        />
      )
    }
  ];

  return (
    <UserAccountPageLayout pageTitle="Manage Genres">
      <Text textStyle="headline-5-medium" textTransform="uppercase">
        Genres
      </Text>
      <Flex width="100%" justifyContent="flex-end">
        <Button
          variant="primary_action"
          rightIcon={<IoMdAddCircle />}
          onClick={() =>
            setSelectedGenre({
              name: '',
              description: ''
            })
          }>
          Add
        </Button>
      </Flex>
      <TableContainer width="100%">
        <Table variant="striped" colorScheme="gray" layout="fixed">
          <Thead>
            <Tr>
              {cols.map((col) => (
                <Th key={col.key} padding="20px 10px">
                  {col.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {getOr(data, 'data', []).map((genre) => (
              <Tr key={genre.id}>
                {cols.map((col) => {
                  const onClickHandler = () => {
                    setSelectedGenre({
                      ...genre
                    });
                  };
                  let element = get(genre, col.path);
                  if (col.render) {
                    if (col.key === 'action')
                      element = col.render(onClickHandler, currentUser.name === genre.name);
                    else element = col.render(get(genre, col.path));
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
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isOpen={!isEmpty(selectedGenre)}
        onClose={() => setSelectedGenre(null)}
        variant="themed">
        <ModalOverlay />
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            name: get(selectedGenre, 'name'),
            description: get(selectedGenre, 'description', [])
          }}
          validateOnChange={false}
          onSubmit={(values) => {
            if (values.id)
              mutateEditGenre({
                id: get(selectedGenre, 'id'),
                name: get(values, 'name'),
                description: get(values, 'description')
              });
            else
              mutateCreateGenre({
                name: get(values, 'name'),
                description: get(values, 'description')
              });
          }}>
          {({ values: formValues, errors, handleSubmit, setFieldValue, dirty }) => (
            <form onSubmit={handleSubmit}>
              <ModalContent maxWidth="600px">
                <ModalHeader>
                  <Text>Genre</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Wrap width="100%" spacing="20px">
                    {cols
                      .filter((col) => col.key !== 'action' && col.editable)
                      .map((col) => (
                        <FormInputField
                          key={col.key}
                          fieldLabel={col.label}
                          hasError={get(errors, col.key)}
                          errorText={get(errors, col.key)}
                          inputFieldProps={{
                            name: `genre-${col.key}`,
                            placeholder: col.key,
                            type: col.key,
                            variant: 'plain',
                            value: get(formValues, col.key),
                            onChange: (e) =>
                              setFieldValue(col.key, e.target.value, !isEmpty(errors))
                          }}
                        />
                      ))}
                  </Wrap>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="primary_action"
                    mr="10px"
                    onClick={handleSubmit}
                    isLoading={mutateEditGenreIsPending || mutateCreateGenreIsPending}
                    isDisabled={!dirty || !formValues.name || !formValues.description}
                    type="submit">
                    Save
                  </Button>
                  <Button onClick={() => setSelectedGenre(null)}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </form>
          )}
        </Formik>
      </Modal>
    </UserAccountPageLayout>
  );
};

const ManageGenresComponent = () => (
  <AuthorizationGate permittedRoles={[USER_ROLES.LIBRARIAN]}>
    <ManageGenres />
  </AuthorizationGate>
);

export default ManageGenresComponent;
