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
  Tr,
  Td,
  Wrap,
  Tag,
  IconButton,
  HStack,
  Checkbox
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserAccountPageLayout } from '@/components/Layouts';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import { useState } from 'react';
import { regulateManager, viewAll as viewAllUsers } from '@/services/api/queries/users';
import { getAxiosErrorDetail, getAxiosResponseBody, getOr } from '@/utils/objects';
import { errorToast, successToast } from '@/utils/toast';
import * as yup from 'yup';
import { FaUserEdit } from 'react-icons/fa';
import { UserInfo } from '@/components/Cards';
import useUserRoles from '@/hooks/useUserRoles';
import { USER_ROLES } from '@/utils/constants';
import useAppStore from '@/lib/store';
import { iff } from '@/utils/helpers';
import { AuthorizationGate } from '@/components/Wrappers';
import TableListContainer from '@/components/Tables/TableListContainer';

const ManageAccounts = () => {
  const { roles } = useUserRoles();
  const {
    userSlice: { currentUser }
  } = useAppStore();

  const [selectedUser, setSelectedUser] = useState(null);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required('input a valid email address'),
    roles: yup.array().of(yup.object()).required('selected at least one role')
  });

  const { data, refetch } = useQuery({
    queryKey: ['viewAllUsers'],
    queryFn: viewAllUsers,
    refetchOnWindowFocus: true
  });

  const { mutate: mutateRegulateManager, isPending: mutateRegulateManagerIsPending } = useMutation({
    mutationFn: regulateManager,
    mutationKey: 'regulateManager',
    onSuccess: (response) => {
      successToast({ message: get(getAxiosResponseBody(response), 'detail', '') });
      refetch();
      setSelectedUser(null);
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const resBody = getAxiosResponseBody(data);

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
      editorPath: 'roles',
      render: (user_role_associations) => (
        <Wrap>
          {user_role_associations.map((user_role_association) => {
            const roleName = getOr(user_role_association, 'role.name', '');
            return (
              <Tag
                key={user_role_association.id}
                colorScheme={iff(
                  roleName === USER_ROLES.BORROWER,
                  'yellow',
                  roleName === USER_ROLES.PROPRIETOR ? 'blue' : 'purple'
                )}
                fontSize="12.5px">
                {roleName}
              </Tag>
            );
          })}
        </Wrap>
      ),
      renderEditor: (selectedUserRoles, onChangeHandler, isDisabled) => (
        <HStack flexWrap="wrap">
          {roles.map((role) => (
            <Checkbox
              key={role.id}
              isChecked={selectedUserRoles.findIndex((userRole) => userRole.id === role.id) > -1}
              onChange={() => onChangeHandler(role)}
              isDisabled={isDisabled || role.name === USER_ROLES.BORROWER}>
              {role.name}
            </Checkbox>
          ))}
        </HStack>
      )
    },
    {
      key: 'is_email_verified',
      label: 'email verified',
      path: 'is_email_verified',
      render: (is_verified) => (
        <Tag colorScheme={is_verified ? 'green' : 'red'} fontSize="12.5px">
          {is_verified ? 'yes' : 'no'}
        </Tag>
      )
    },
    {
      key: 'created_at',
      label: 'date joined',
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
      key: 'action',
      label: 'action',
      path: null,
      render: (onClickHandler, isDisabled) => (
        <IconButton
          variant="primary_action"
          icon={<FaUserEdit />}
          onClick={() => onClickHandler()}
          isDisabled={isDisabled}
        />
      )
    }
  ];

  return (
    <UserAccountPageLayout pageTitle="Manage">
      <Text textStyle="headline-5-medium" textTransform="uppercase">
        Users
      </Text>
      <TableListContainer cols={cols} width="100%">
        {getOr(resBody, 'data', []).map((user) => (
          <Tr key={user.email}>
            {cols.map((col) => {
              const onClickHandler = () => {
                setSelectedUser({
                  ...user,
                  roles: user.user_role_associations.map((item) => item.role)
                });
              };
              let element = get(user, col.path);
              if (col.render) {
                if (col.key === 'action')
                  element = col.render(onClickHandler, currentUser.email === user.email);
                else element = col.render(get(user, col.path));
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
      <Modal isOpen={!isEmpty(selectedUser)} onClose={() => setSelectedUser(null)} variant="themed">
        <ModalOverlay />
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            email: get(selectedUser, 'email'),
            roles: get(selectedUser, 'roles', [])
          }}
          validateOnChange={false}
          onSubmit={(values) => {
            mutateRegulateManager({
              email: get(selectedUser, 'email'),
              role_ids: get(values, 'roles', []).map((role) => role.id)
            });
          }}>
          {({ values: formValues, errors, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <ModalContent maxWidth="600px">
                <ModalHeader>
                  <Text>User</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Wrap width="100%" spacingX="50px" spacingY="70px">
                    {cols
                      .filter((col) => col.key !== 'action')
                      .map((col) => {
                        const onChangeHandler = (selectedRole) => {
                          let formSelectedRoles = getOr(formValues, 'roles', []);
                          const alreadySelected =
                            formSelectedRoles.findIndex((role) => role.id === selectedRole.id) > -1;
                          formSelectedRoles = alreadySelected
                            ? formSelectedRoles.filter(
                                (formSelectedRole) => formSelectedRole.id !== selectedRole.id
                              )
                            : [...formSelectedRoles, selectedRole];
                          setFieldValue('roles', formSelectedRoles, !isEmpty(errors));
                        };
                        let detail = get(selectedUser, col.path);
                        if (col.renderEditor)
                          detail = col.renderEditor(
                            get(formValues, col.editorPath),
                            onChangeHandler
                          );
                        else if (col.render) detail = col.render(get(selectedUser, col.path));

                        return <UserInfo key={col.key} label={col.label} detail={detail} />;
                      })}
                  </Wrap>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="primary_action"
                    mr="10px"
                    onClick={handleSubmit}
                    isLoading={mutateRegulateManagerIsPending}
                    isDisabled={currentUser.email === selectedUser.email}
                    type="submit">
                    Save
                  </Button>
                  <Button onClick={() => setSelectedUser(null)}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </form>
          )}
        </Formik>
      </Modal>
    </UserAccountPageLayout>
  );
};

const ManageAccountsComponent = () => (
  <AuthorizationGate permittedRoles={[USER_ROLES.LIBRARIAN]}>
    <ManageAccounts />
  </AuthorizationGate>
);

export default ManageAccountsComponent;
