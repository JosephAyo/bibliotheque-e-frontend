import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { AuthFormInputField } from 'components/Inputs';
import { AuthPageLayout } from 'components/Layouts';
import { AuthFormActionButton } from 'components/Buttons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import { login } from 'services/api/queries/users';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { errorToast } from 'utils/toast';
import { getAxiosErrorDetail, getAxiosResponseBody } from 'utils/objects';
import * as yup from 'yup';
import { setAuthToken, setUser } from 'config/axios';

const Login = () => {
  const router = useRouter();
  const formikRef = useRef(null);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required('input a valid email address'),
    password: yup.string().min(6).required()
  });

  const { mutate: mutateLogin } = useMutation({
    mutationFn: login,
    mutationKey: 'login',
    onSuccess: (data) => {
      const resBody = getAxiosResponseBody(data);
      router.push('/library/books');
      setAuthToken(get(resBody, 'access_token'));
      setUser(get(resBody, 'user'));
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });
  return (
    <AuthPageLayout>
      <Formik
        innerRef={formikRef}
        validationSchema={validationSchema}
        initialValues={{
          email: '',
          password: ''
        }}
        validateOnChange={false}
        onSubmit={(values) => {
          mutateLogin(values);
        }}>
        {({ values, errors, handleSubmit, setFieldValue }) => (
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
            </VStack>
            <AuthFormActionButton onClick={handleSubmit}>Login</AuthFormActionButton>
            <Text textStyle="caption">
              Don&rsquo;t have an account?&nbsp;
              <Box as="span" textStyle="caption-medium" color="primary.default">
                <Link href="/signup">Sign Up</Link>
              </Box>
            </Text>
            <Flex>
              <Link href="/reset-password">
                <Text color="primary.default" textStyle="caption-medium">
                  Forgot password?
                </Text>
              </Link>
            </Flex>
          </VStack>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default Login;
