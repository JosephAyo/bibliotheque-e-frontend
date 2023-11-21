import {
  Button,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Wrap,
  Tag,
  IconButton
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserAccountPageLayout } from 'components/Layouts';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { addManager, viewAll as viewAllUsers } from 'services/api/queries/users';
import { getAxiosErrorDetail, getAxiosResponseBody, getOr } from 'utils/objects';
import { errorToast, successToast } from 'utils/toast';
import * as yup from 'yup';
import { FaUserEdit } from 'react-icons/fa';

const Account = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const modalOverlayBg = useColorModeValue('#555555ee', '#000000ee');

  const passwordFormikRef = useRef(null);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required('input a valid email address')
  });

  const { mutate: mutateAddManager } = useMutation({
    mutationFn: addManager,
    mutationKey: 'addManager',
    onSuccess: (data) => {
      successToast({ message: get(getAxiosResponseBody(data), 'detail', '') });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const { data } = useQuery({ queryKey: ['viewAllUsers'], queryFn: viewAllUsers });

  const resBody = getAxiosResponseBody(data);

  console.log('resBody :>> ', resBody);

  const cols = [
    {
      key: 'email',
      label: 'email',
      path: 'email'
    },
    {
      key: 'first_name',
      label: 'first name',
      path: 'first_name'
    },
    {
      key: 'last_name',
      label: 'last name',
      path: 'last_name'
    },
    {
      key: 'user_role_associations',
      label: 'roles',
      path: 'user_role_associations',
      render: (user_role_associations) => (
        <Wrap>
          {user_role_associations.map((user_role_association) => (
            <Tag key={user_role_association.id}>{getOr(user_role_association, 'role.name')}</Tag>
          ))}
        </Wrap>
      )
    },
    {
      key: 'is_email_verified',
      label: 'email verified',
      path: 'is_email_verified',
      render: (is_verified) => <Tag>{is_verified ? 'verified' : 'not verified'}</Tag>
    },
    {
      key: 'created_at',
      label: 'date joined',
      path: 'created_at',
      render: (date) => new Intl.DateTimeFormat(undefined).format(new Date(date))
    },
    {
      key: 'action',
      label: 'action',
      path: null,
      render: (onClickHandler) => (
        <IconButton
          variant="primary_action"
          icon={<FaUserEdit />}
          onClick={() => onClickHandler()}
        />
      )
    }
  ];

  return (
    <UserAccountPageLayout pageTitle="Manage">
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
            {getOr(resBody, 'data', []).map((user) => (
              <Tr key={user.email}>
                {cols.map((col) => {
                  const onClickHandler = () => {
                    setSelectedUser(user);
                  };
                  let element = getOr(user, col.path);
                  if (col.render) {
                    if (col.key === 'action') element = col.render(onClickHandler);
                    else element = col.render(getOr(user, col.path));
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
      <Modal isOpen={!isEmpty(selectedUser)} onClose={() => setSelectedUser(null)}>
        <ModalOverlay background={modalOverlayBg} />
        <Formik
          innerRef={passwordFormikRef}
          validationSchema={validationSchema}
          initialValues={{
            roles: get(selectedUser, 'roles', [])
          }}
          validateOnChange={false}
          onSubmit={(values) => {
            mutateAddManager({
              email: get(selectedUser, 'email'),
              role_id: get(values, 'role_id')
            });
          }}>
          {({ values, errors, handleSubmit, setFieldValue }) => (
            <ModalContent>
              <ModalHeader>
                <Text>Edit user</Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack align="stretch" width="100%" spacing="22px">
                  Do stuff
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="primary_action" mr="10px" onClick={handleSubmit}>
                  Save
                </Button>
                <Button onClick={() => setSelectedUser(null)}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Formik>
      </Modal>
    </UserAccountPageLayout>
  );
};

export default Account;
