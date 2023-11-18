import { Box, HStack, PinInput, PinInputField, Text, VStack } from '@chakra-ui/react';
import { AuthPageLayout } from 'components/Layouts';
import { AuthFormActionButton } from 'components/Buttons';
import { useRouter } from 'next/router';

const Verification = () => {
  const router = useRouter();

  return (
    <AuthPageLayout>
      <VStack
        rounded="10px"
        padding="64px"
        width="464px"
        spacing="48px"
        layerStyle="auth_form_container">
        <Text textStyle="headline-5-medium">Verification</Text>
        <VStack spacing="35px">
          <VStack spacing="16px">
            <Text textStyle="body-medium">We sent you a code!</Text>
            <Text textStyle="caption" textAlign="center">
              Enter the 6 digit code we sent you <br /> to verify your email
            </Text>
          </VStack>
          <HStack>
            <PinInput otp>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        </VStack>
        <AuthFormActionButton onClick={() => router.push('/library/books')}>
          Verify
        </AuthFormActionButton>
        <Text textStyle="caption">
          Didn&rsquo;t receive code?&nbsp;
          <Box as="button" textStyle="caption-medium" color="primary.default">
            Resend code
          </Box>
        </Text>
      </VStack>
    </AuthPageLayout>
  );
};

export default Verification;
