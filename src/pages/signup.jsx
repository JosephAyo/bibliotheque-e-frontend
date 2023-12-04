import { Box, Text, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { AuthFormActionButton } from '@/components/Buttons';
import { FormInputField } from '@/components/Inputs';
import { AuthPageLayout } from '@/components/Layouts';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { signup } from '@/services/api/queries/users';
import { getAxiosErrorDetail } from '@/utils/objects';
import { errorToast } from '@/utils/toast';
import * as yup from 'yup';

const Signup = () => {
  const router = useRouter();

  const formikRef = useRef(null);

  const validationSchema = yup.object().shape({
    first_name: yup.string().required().label('first name'),
    last_name: yup.string().required().label('last name'),
    email: yup.string().email().required('input a valid email address'),
    password: yup.string().min(6).required()
  });

  const { mutate: mutateSignUp, isPending } = useMutation({
    mutationFn: signup,
    mutationKey: 'signup',
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
          <form>
            <VStack
              rounded="10px"
              padding="44px"
              width="464px"
              spacing="28px"
              layerStyle="auth_form_container">
              <Text textStyle="headline-5-medium">Create account</Text>
              <VStack align="stretch" width="100%" spacing="22px">
                <FormInputField
                  fieldLabel="First name"
                  hasError={get(errors, 'first_name')}
                  errorText={get(errors, 'first_name')}
                  inputFieldProps={{
                    name: 'first_name',
                    placeholder: 'John',
                    variant: 'plain',
                    value: get(values, 'first_name'),
                    onChange: (e) => setFieldValue('first_name', e.target.value, !isEmpty(errors)),
                    autoComplete: 'given-name'
                  }}
                />
                <FormInputField
                  fieldLabel="Last name"
                  hasError={get(errors, 'last_name')}
                  errorText={get(errors, 'last_name')}
                  inputFieldProps={{
                    name: 'last_name',
                    placeholder: 'Doe',
                    variant: 'plain',
                    value: get(values, 'last_name'),
                    onChange: (e) => setFieldValue('last_name', e.target.value, !isEmpty(errors)),
                    autoComplete: 'family-name'
                  }}
                />
                <FormInputField
                  fieldLabel="Email"
                  hasError={get(errors, 'email')}
                  errorText={get(errors, 'email')}
                  inputFieldProps={{
                    name: 'email',
                    placeholder: 'example@email.com',
                    type: 'email',
                    variant: 'plain',
                    value: get(values, 'email'),
                    onChange: (e) => setFieldValue('email', e.target.value, !isEmpty(errors)),
                    autoComplete: 'email'
                  }}
                />
                <FormInputField
                  fieldLabel="Password"
                  hasError={get(errors, 'password')}
                  errorText={get(errors, 'password')}
                  inputFieldProps={{
                    name: 'password',
                    placeholder: '******',
                    type: 'password',
                    variant: 'plain',
                    value: get(values, 'password'),
                    onChange: (e) => setFieldValue('password', e.target.value, !isEmpty(errors)),
                    autoComplete: 'current-password'
                  }}
                />
              </VStack>
              <AuthFormActionButton onClick={handleSubmit} isLoading={isPending}>
                Sign Up
              </AuthFormActionButton>
              <Text textStyle="caption">
                Have an account already&nbsp;
                <Box as="span" textStyle="caption-medium" color="primary.default">
                  <Link href="/login">Log In</Link>
                </Box>
              </Text>
            </VStack>
          </form>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default Signup;
