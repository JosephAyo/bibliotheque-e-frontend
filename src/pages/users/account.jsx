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
  useDisclosure,
  useColorModeValue
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { AuthFormInputField } from 'components/Inputs';
import { UserAccountPageLayout } from 'components/Layouts';
import { Formik } from 'formik';
import useAppStore from 'lib/store';
import { get, isEmpty } from 'lodash';
import { useRef } from 'react';
import { changePassword, editProfile } from 'services/api/queries/users';
import { getAxiosErrorDetail, getAxiosResponseBody } from 'utils/objects';
import { errorToast, successToast } from 'utils/toast';
import * as yup from 'yup';

const Account = () => {
  const {
    userSlice: { currentUser }
  } = useAppStore();

  const modalOverlayBg = useColorModeValue('#555555ee', '#000000ee');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const passwordFormikRef = useRef(null);

  const namesValidationSchema = yup.object().shape({
    first_name: yup.string().required().label('first name'),
    last_name: yup.string().required().label('last name')
  });

  const { mutate: mutateEditProfile } = useMutation({
    mutationFn: editProfile,
    mutationKey: 'editProfile',
    onSuccess: (data) => {
      successToast({ message: get(getAxiosResponseBody(data), 'detail', '') });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const passwordValidationSchema = yup.object().shape({
    current_password: yup.string().min(6).required().label('current password'),
    new_password: yup.string().min(6).required().label('new password')
  });

  const { mutate: mutateChangePassword } = useMutation({
    mutationFn: changePassword,
    mutationKey: 'changePassword',
    onSuccess: (data) => {
      passwordFormikRef.current.resetForm();
      successToast({ message: get(getAxiosResponseBody(data), 'detail', '') });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  return (
    <UserAccountPageLayout pageTitle="Account">
      <VStack
        align="stretch"
        rounded="10px"
        padding="44px"
        width="100%"
        spacing="22px"
        marginTop="20px">
        <Text textStyle="headline-5-medium" alignSelf="flex-start">
          User profile
        </Text>
        <Formik
          validationSchema={namesValidationSchema}
          initialValues={{
            first_name: get(currentUser, 'first_name'),
            last_name: get(currentUser, 'last_name'),
            email: get(currentUser, 'email')
          }}
          validateOnChange={false}
          onSubmit={(values) => {
            mutateEditProfile({
              first_name: get(values, 'first_name'),
              last_name: get(values, 'last_name')
            });
          }}
          enableReinitialize>
          {({ values, errors, handleSubmit, setFieldValue }) => (
            <>
              <AuthFormInputField
                fieldLabel="First name"
                hasError={get(errors, 'first_name')}
                errorText={get(errors, 'first_name')}
                inputFieldProps={{
                  name: 'first_name',
                  placeholder: 'John',
                  variant: 'auth_plain',
                  value: get(values, 'first_name'),
                  onChange: (e) => setFieldValue('first_name', e.target.value, !isEmpty(errors))
                }}
              />
              <AuthFormInputField
                fieldLabel="Last name"
                hasError={get(errors, 'last_name')}
                errorText={get(errors, 'last_name')}
                inputFieldProps={{
                  name: 'last_name',
                  placeholder: 'Doe',
                  variant: 'auth_plain',
                  value: get(values, 'last_name'),
                  onChange: (e) => setFieldValue('last_name', e.target.value, !isEmpty(errors))
                }}
              />
              <AuthFormInputField
                fieldLabel="Email"
                inputFieldProps={{
                  name: 'email',
                  placeholder: 'example@email.com',
                  type: 'email',
                  isDisabled: true,
                  variant: 'auth_filled',
                  value: get(values, 'email')
                }}
              />

              <Button
                variant="primary_action"
                width="max-content"
                marginLeft="auto"
                onClick={handleSubmit}>
                Save
              </Button>
            </>
          )}
        </Formik>
        <br />
        <AuthFormInputField
          fieldLabel="Current password"
          inputFieldProps={{
            name: 'password',
            placeholder: '******',
            type: 'password',
            isDisabled: true,
            variant: 'auth_filled'
          }}
        />
        <Button variant="primary_action" width="max-content" marginLeft="auto" onClick={onOpen}>
          Change password
        </Button>
      </VStack>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay background={modalOverlayBg} />
        <Formik
          innerRef={passwordFormikRef}
          validationSchema={passwordValidationSchema}
          initialValues={{
            current_password: '',
            new_password: ''
          }}
          validateOnChange={false}
          onSubmit={(values) => {
            mutateChangePassword({
              current_password: get(values, 'current_password'),
              new_password: get(values, 'new_password')
            });
          }}>
          {({ values, errors, handleSubmit, setFieldValue }) => (
            <ModalContent>
              <ModalHeader>
                <Text>Change password</Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack align="stretch" width="100%" spacing="22px">
                  <AuthFormInputField
                    fieldLabel="Current password"
                    hasError={get(errors, 'current_password')}
                    errorText={get(errors, 'current_password')}
                    inputFieldProps={{
                      name: 'password',
                      placeholder: '******',
                      type: 'password',
                      variant: 'auth_filled',
                      ref: initialRef,
                      value: get(values, 'current_password'),
                      onChange: (e) =>
                        setFieldValue('current_password', e.target.value, !isEmpty(errors))
                    }}
                  />
                  <AuthFormInputField
                    fieldLabel="New password"
                    hasError={get(errors, 'new_password')}
                    errorText={get(errors, 'new_password')}
                    inputFieldProps={{
                      name: 'new_password',
                      placeholder: '******',
                      variant: 'auth_filled',
                      type: 'password',
                      value: get(values, 'new_password'),
                      onChange: (e) =>
                        setFieldValue('new_password', e.target.value, !isEmpty(errors))
                    }}
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="primary_action" mr="10px" onClick={handleSubmit}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Formik>
      </Modal>
    </UserAccountPageLayout>
  );
};

export default Account;
