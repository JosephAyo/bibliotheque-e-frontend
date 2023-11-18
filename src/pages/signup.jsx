import { Box, Text, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { AuthFormActionButton } from 'components/Buttons';
import { AuthFormInputField } from 'components/Inputs';
import { AuthPageLayout } from 'components/Layouts';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { signup } from 'services/api/queries/users';
import { getAxiosErrorDetail } from 'utils/objects';
import { errorToast } from 'utils/toast';
import * as yup from 'yup';

const Signup = () => {
  const router = useRouter();

  const formikRef = useRef(null);

  const validationSchema = yup.object().shape({
    first_name: yup.string().required().label('first name'),
    last_name: yup.string().required().label('last name'),
    email: yup.string().email().required('Input a valid email address'),
    password: yup.string().min(6).required()
  });

  const { mutate: mutateSignUp } = useMutation({
    mutationFn: signup,
    mutationKey: 'registerRequest',
    onSuccess: () => {
      const email = get(formikRef.current, 'values.email');
      router.push({ pathname: '/verification', query: { email } });
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
          first_name: '',
          last_name: '',
          email: '',
          password: ''
        }}
        validateOnChange={false}
        onSubmit={(values) => {
          mutateSignUp(values);
        }}>
        {({ values, errors, handleSubmit, setFieldValue }) => (
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
            <AuthFormActionButton onClick={handleSubmit}>Sign Up</AuthFormActionButton>
            <Text textStyle="caption">
              Have an account already&nbsp;
              <Box as="span" textStyle="caption-medium" color="primary.default">
                <Link href="/login">Log In</Link>
              </Box>
            </Text>
          </VStack>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default Signup;
