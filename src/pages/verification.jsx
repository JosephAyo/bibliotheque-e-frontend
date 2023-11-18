import { Box, Text, VStack } from '@chakra-ui/react';
import { AuthPageLayout } from 'components/Layouts';
import { AuthFormActionButton } from 'components/Buttons';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { get, isEmpty } from 'lodash';
import { OtpInputField } from 'components/Inputs';

const Verification = () => {
  const router = useRouter();

  const validationSchema = yup.object().shape({
    code: yup.string().length(6).required()
  });

  return (
    <AuthPageLayout>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          first_name: '',
          last_name: '',
          email: '',
          password: ''
        }}
        validateOnChange={false}
        onSubmit={() => {
          router.push('/library/books');
        }}>
        {({ values, errors, handleSubmit, setFieldValue }) => (
          <VStack
            rounded="10px"
            padding="64px"
            width="464px"
            spacing="48px"
            layerStyle="auth_form_container">
            <Text textStyle="headline-5-medium">Verification</Text>
            <OtpInputField
              value={get(values, 'code')}
              hasError={get(errors, 'code')}
              errorText={get(errors, 'code')}
              onChange={(value) => setFieldValue('code', value, !isEmpty(errors))}
            />
            <AuthFormActionButton onClick={handleSubmit}>Verify</AuthFormActionButton>
            <Text textStyle="caption">
              Didn&rsquo;t receive code?&nbsp;
              <Box as="button" textStyle="caption-medium" color="primary.default">
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
