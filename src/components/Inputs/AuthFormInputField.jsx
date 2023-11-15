import { Input, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const AuthFormInputField = ({ inputFieldProps, fieldLabel }) => {
  const inputBackground = useColorModeValue('white');
  return (
    <VStack spacing="4px" alignItems="flex-start">
      {fieldLabel ? <Text textStyle="body-medium">{fieldLabel}</Text> : ''}
      <Input
        variant="filled"
        type="text"
        borderWidth="1px"
        backgroundColor={inputBackground}
        {...inputFieldProps}
      />
    </VStack>
  );
};

export default AuthFormInputField;
