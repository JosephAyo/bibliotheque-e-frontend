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
import { AuthFormInputField } from 'components/Inputs';
import { UserAccountPageLayout } from 'components/Layouts';
import { useRef } from 'react';

const Account = () => {
  const modalOverlayBg = useColorModeValue('#555555ee', '#000000ee');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

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
        <AuthFormInputField
          fieldLabel="First name"
          inputFieldProps={{
            name: 'first_name',
            placeholder: 'John',
            variant: 'auth_filled'
          }}
        />
        <AuthFormInputField
          fieldLabel="Last name"
          inputFieldProps={{
            name: 'last_name',
            placeholder: 'Doe',
            variant: 'auth_filled'
          }}
        />
        <AuthFormInputField
          fieldLabel="Email"
          inputFieldProps={{
            name: 'email',
            placeholder: 'example@email.com',
            type: 'email',
            isDisabled: true,
            variant: 'auth_filled'
          }}
        />

        <Button variant="primary_action" width="max-content" marginLeft="auto">
          Save
        </Button>
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
        <ModalContent>
          <ModalHeader>
            <Text>Change password</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="stretch" width="100%" spacing="22px">
              <AuthFormInputField
                fieldLabel="Current password"
                inputFieldProps={{
                  name: 'password',
                  placeholder: '******',
                  type: 'password',
                  variant: 'auth_filled',
                  ref: initialRef
                }}
              />
              <AuthFormInputField
                fieldLabel="New password"
                inputFieldProps={{
                  name: 'new_password',
                  placeholder: '******',
                  variant: 'auth_filled',
                  type: 'password'
                }}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="primary_action" mr="10px">
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </UserAccountPageLayout>
  );
};

export default Account;
