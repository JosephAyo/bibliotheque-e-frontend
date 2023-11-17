import { Input, Text, VStack } from '@chakra-ui/react';

const AuthFormInputField = ({ inputFieldProps, fieldLabel }) => (
  <VStack spacing="4px" alignItems="flex-start">
    {fieldLabel ? <Text textStyle="body-medium">{fieldLabel}</Text> : ''}
    <Input type="text" borderWidth="1px" {...inputFieldProps} />
  </VStack>
);
export default AuthFormInputField;
