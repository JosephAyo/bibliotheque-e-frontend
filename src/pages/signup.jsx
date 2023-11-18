import { Box, Text, VStack } from '@chakra-ui/react';
import { AuthFormActionButton } from 'components/Buttons';
import { AuthFormInputField } from 'components/Inputs';
import { AuthPageLayout } from 'components/Layouts';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Signup = () => {
  const router = useRouter();

  return (
    <AuthPageLayout>
      <VStack
        rounded="10px"
        padding="44px"
        width="464px"
        spacing="28px"
        layerStyle="auth_form_container">
        <Text textStyle="headline-5-medium">Create account</Text>
        <VStack align="stretch" width="100%" spacing="22px">
          <AuthFormInputField
            fieldLabel="First name"
            inputFieldProps={{
              name: 'first_name',
              placeholder: 'John',
              variant: 'auth_plain'
            }}
          />
          <AuthFormInputField
            fieldLabel="Last name"
            inputFieldProps={{
              name: 'last_name',
              placeholder: 'Doe',
              variant: 'auth_plain'
            }}
          />
          <AuthFormInputField
            fieldLabel="Email"
            inputFieldProps={{
              name: 'email',
              placeholder: 'example@email.com',
              type: 'email',
              variant: 'auth_plain'
            }}
          />
          <AuthFormInputField
            fieldLabel="Password"
            inputFieldProps={{
              name: 'password',
              placeholder: '******',
              type: 'password',
              variant: 'auth_plain'
            }}
          />
        </VStack>
        <AuthFormActionButton onClick={() => router.push('/verification')}>
          Sign Up
        </AuthFormActionButton>
        <Text textStyle="caption">
          Have an account already&nbsp;
          <Box as="span" textStyle="caption-medium" color="primary.default">
            <Link href="/login">Log In</Link>
          </Box>
        </Text>
      </VStack>
    </AuthPageLayout>
  );
};

export default Signup;
