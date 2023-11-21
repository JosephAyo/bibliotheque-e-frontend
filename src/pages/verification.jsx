import { Box, Text, VStack } from '@chakra-ui/react';
import { AuthPageLayout } from 'components/Layouts';
import { AuthFormActionButton } from 'components/Buttons';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { get, isEmpty } from 'lodash';
import { OtpInputField } from 'components/Inputs';
import { useMutation } from '@tanstack/react-query';
import { resendVerificationEmail, verifyEmail } from 'services/api/queries/users';
import { getAxiosErrorDetail, getAxiosResponseBody, getOr } from 'utils/objects';
import { errorToast, successToast } from 'utils/toast';
import { useEffect } from 'react';
import useAppStore from 'lib/store';

const Verification = () => {
  const router = useRouter();
  const {
    userSlice: {
      currentUser: { is_logged_in }
    }
  } = useAppStore();

  useEffect(() => {
    if (!router.query.email)
      if (is_logged_in) {
        router.back();
      } else router.push('/login');
  }, [router, is_logged_in]);

  const validationSchema = yup.object().shape({
    verification_code: yup.string().length(6).required().label('verification code')
  });

  const { mutate: mutateVerifyEmail, isPending: mutateVerifyEmailIsPending } = useMutation({
    mutationFn: verifyEmail,
    mutationKey: 'verifyEmail',
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const {
    mutate: mutateResendVerificationEmail,
    isPending: mutateResendVerificationEmailIsPending
  } = useMutation({
    mutationFn: resendVerificationEmail,
    mutationKey: 'resendVerificationEmail',
    onSuccess: (data) => {
      successToast({ message: get(getAxiosResponseBody(data), 'detail', '') });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  return (
    <AuthPageLayout>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: getOr(router, 'query.email', ''),
          verification_code: ''
        }}
        validateOnChange={false}
        onSubmit={(values) => {
          mutateVerifyEmail(values);
        }}>
        {({ values, errors, handleSubmit, setFieldValue }) => (
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
              <OtpInputField
                value={get(values, 'verification_code')}
                hasError={get(errors, 'verification_code')}
                errorText={get(errors, 'verification_code')}
                onChange={(value) => setFieldValue('verification_code', value, !isEmpty(errors))}
              />
            </VStack>
            <AuthFormActionButton
              onClick={handleSubmit}
              isLoading={mutateVerifyEmailIsPending}
              isDisabled={mutateResendVerificationEmailIsPending}>
              Verify
            </AuthFormActionButton>
            <Text textStyle="caption">
              Didn&rsquo;t receive code?&nbsp;
              <Box
                as="button"
                textStyle="caption-medium"
                color="primary.default"
                onClick={() =>
                  mutateResendVerificationEmail({
                    email: values.email
                  })
                }>
                Resend code
              </Box>
            </Text>
          </VStack>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default Verification;
