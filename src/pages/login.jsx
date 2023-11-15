import { Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { AuthFormInputField } from 'components/Inputs';
import { AuthPageLayout } from 'components/Layouts';
import { AuthFormActionButton } from 'components/Buttons';
import Link from 'next/link';

const Login = () => {
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
        <Text textStyle="headline-5-medium">Log In</Text>
        <VStack align="stretch" width="100%" spacing="22px">
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
        <AuthFormActionButton>Login</AuthFormActionButton>
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
      </VStack>
    </AuthPageLayout>
  );
};

export default Login;
