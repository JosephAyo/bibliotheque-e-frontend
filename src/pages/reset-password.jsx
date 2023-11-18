import {
  Text,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  FormErrorMessage,
  Box,
  FormControl,
  Button
} from '@chakra-ui/react';
import { AuthFormActionButton } from 'components/Buttons';
import { AuthFormInputField } from 'components/Inputs';
import { AuthPageLayout } from 'components/Layouts';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useMemo, useRef } from 'react';
import { getOr } from 'utils/objects';
import * as yup from 'yup';

const ResetPassword = () => {
  const router = useRouter();
  const formikRef = useRef(null);

  const phase = useMemo(() => {
    const email = getOr(router, 'query.email', null);
    const code = getOr(router, 'query.code', null);
    if (!isEmpty(email) && !isEmpty(code)) return 2;
    if (!isEmpty(email) && isEmpty(code)) return 1;
    if (isEmpty(email)) return 0;

    return 0;
  }, [router]);

  const getSubmitBtnText = () => {
    switch (phase) {
      case 0:
        return 'Send Verification Code';

      case 1:
        return 'Verify';

      case 2:
        return 'Reset Password';

      default:
        return 'Send Verification Code';
    }
  };

  const emailValidationSchema = yup.object().shape({
    email: yup.string().email().required('Input a valid email address')
  });

  const codeValidationSchema = yup.object().shape({
    code: yup.string().min(6).required()
  });

  const passwordValidationSchema = yup.object().shape({
    password: yup.string().min(6).required(),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('confirm password is required')
  });

  const getValidationSchema = () => {
    switch (phase) {
      case 0:
        return emailValidationSchema;

      case 1:
        return codeValidationSchema;

      case 2:
        return passwordValidationSchema;

      default:
        return emailValidationSchema;
    }
  };

  return (
    <AuthPageLayout>
      <Formik
        innerRef={formikRef}
        validationSchema={getValidationSchema()}
        initialValues={{
          email: getOr(router, 'query.email', ''),
          code: getOr(router, 'query.code', ''),
          password: '',
          confirm_password: ''
        }}
        validateOnChange={false}
        onSubmit={(values) => {
          switch (phase) {
            case 2:
              router.push('/login');
              break;

            default:
              router.push({
                pathname: 'reset-password',
                query: Object.keys(values).reduce(
                  (accumulated, current) =>
                    ['email', 'code'].includes(current)
                      ? { ...accumulated, [current]: values[current] }
                      : accumulated,
                  {}
                )
              });
              break;
          }
        }}>
        {({ values, errors, handleSubmit, setFieldValue }) => (
          <VStack
            rounded="10px"
            padding="44px"
            width="464px"
            spacing="28px"
            layerStyle="auth_form_container">
            <Text textStyle="headline-5-medium">
              {phase === 2 ? 'Reset password' : 'Forgot password'}
            </Text>
            <VStack align="stretch" width="100%" spacing="22px">
              {phase === 0 ? (
                <AuthFormInputField
                  fieldLabel="Email"
                  hasError={get(errors, 'email')}
                  errorText={get(errors, 'email')}
                  inputFieldProps={{
                    name: 'email',
                    placeholder: 'example@email.com',
                    type: 'email',
                    variant: 'auth_plain',
                    value: get(values, 'email'),
                    onChange: (e) => setFieldValue('email', e.target.value, !isEmpty(errors))
                  }}
                />
              ) : (
                ''
              )}
              {phase === 1 ? (
                <VStack spacing="23px">
                  <FormControl isInvalid={get(errors, 'code')}>
                    <VStack>
                      <HStack>
                        <PinInput
                          otp
                          isInvalid={get(errors, 'code')}
                          onChange={(value) => setFieldValue('code', value, !isEmpty(errors))}>
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                        </PinInput>
                      </HStack>
                      <Box>
                        <FormErrorMessage>{get(errors, 'code')}</FormErrorMessage>
                      </Box>
                    </VStack>
                  </FormControl>
                  <Text textStyle="caption" textAlign="center">
                    Enter the code that was send your email
                    <br />
                    <Box as="span" textStyle="caption-medium" color="primary.default">
                      {get(values, 'email')}
                    </Box>
                  </Text>
                  <Text textStyle="caption" marginTop="30px">
                    This code will expire inå&nbsp;
                    <Box as="span" textStyle="caption-medium" color="primary.default">
                      5 minutes
                    </Box>
                  </Text>
                </VStack>
              ) : (
                ''
              )}
              {phase === 2 ? (
                <>
                  <AuthFormInputField
                    fieldLabel="Password"
                    hasError={get(errors, 'password')}
                    errorText={get(errors, 'password')}
                    inputFieldProps={{
                      name: 'password',
                      placeholder: '******',
                      type: 'password',
                      variant: 'auth_plain',
                      value: get(values, 'password'),
                      onChange: (e) => setFieldValue('password', e.target.value, !isEmpty(errors))
                    }}
                  />
                  <AuthFormInputField
                    fieldLabel="Confirm password"
                    hasError={get(errors, 'confirm_password')}
                    errorText={get(errors, 'confirm_password')}
                    inputFieldProps={{
                      name: 'confirm_password',
                      placeholder: '******',
                      type: 'password',
                      variant: 'auth_plain',
                      value: get(values, 'confirm_password'),
                      onChange: (e) =>
                        setFieldValue('confirm_password', e.target.value, !isEmpty(errors))
                    }}
                  />
                </>
              ) : (
                ''
              )}
            </VStack>
            <Box width="100%">
              <AuthFormActionButton onClick={() => handleSubmit()}>
                {getSubmitBtnText()}
              </AuthFormActionButton>
              {phase === 1 ? (
                <Button width="100%" variant="secondary_action" marginTop="18px">
                  Resend code
                </Button>
              ) : (
                ''
              )}
            </Box>
          </VStack>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default ResetPassword;
