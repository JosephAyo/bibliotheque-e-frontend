import { Flex, Text, VStack } from '@chakra-ui/react';
import { AuthFormInputField } from 'components/Inputs';
import { AuthPageLayout } from 'components/Layouts';
import { AuthFormActionButton } from 'components/Buttons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  return (
    <AuthPageLayout>
      <VStack
        rounded="10px"
        padding="44px"
        width="464px"
        spacing="28px"
        layerStyle="auth_form_container">
        <Text textStyle="headline-5-medium">Log In</Text>
        <VStack align="stretch" width="100%" spacing="22px">
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
        <AuthFormActionButton onClick={() => router.push('/library/books')}>
          Login
        </AuthFormActionButton>
        <Flex>
          <Text marginRight="4px" textStyle="caption">
            Don&rsquo;t have an account?
          </Text>
          <Link href="/signup">
            <Text color="primary.default" textStyle="caption-medium">
              Sign Up
            </Text>
          </Link>
        </Flex>
        <Flex>
          <Link href="/reset-password">
            <Text color="primary.default" textStyle="caption-medium">
              Forgot password?
            </Text>
          </Link>
        </Flex>
      </VStack>
    </AuthPageLayout>
  );
};

export default Login;
