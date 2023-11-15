import { Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { AuthFormActionButton } from 'components/Buttons';
import { AuthFormInputField } from 'components/Inputs';
import { AuthPageLayout } from 'components/Layouts';
import Link from 'next/link';

const Signup = () => {
  const formBackground = useColorModeValue('#f6f6f6', 'gray.600');

  return (
    <AuthPageLayout>
      <VStack
        flexDirection="column"
        background={formBackground}
        rounded="10px"
        padding="44px"
        width="464px"
        spacing="28px">
        <Text textStyle="headline-5-medium">Create account</Text>
        <VStack align="stretch" width="100%" spacing="22px">
          <AuthFormInputField
            fieldLabel="First name"
            inputFieldProps={{
              name: 'first_name',
              placeholder: 'John'
            }}
          />
          <AuthFormInputField
            fieldLabel="Last name"
            inputFieldProps={{
              name: 'last_name',
              placeholder: 'Doe'
            }}
          />
          <AuthFormInputField
            fieldLabel="Email"
            inputFieldProps={{
              name: 'email',
              placeholder: 'example@email.com',
              type: 'email'
            }}
          />
          <AuthFormInputField
            fieldLabel="Password"
            inputFieldProps={{
              name: 'password',
              placeholder: '******',
              type: 'password'
            }}
          />
        </VStack>
        <AuthFormActionButton>Sign Up</AuthFormActionButton>
        <Flex>
          <Text marginRight="4px" textStyle="caption">
            Have an account already
          </Text>
          <Link href="/login">
            <Text color="primary.default" textStyle="caption-medium">
              Log In
            </Text>
          </Link>
        </Flex>
      </VStack>
    </AuthPageLayout>
  );
};

export default Signup;
