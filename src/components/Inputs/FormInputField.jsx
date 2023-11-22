import { FormControl, FormErrorMessage, Input, Text, VStack } from '@chakra-ui/react';

const FormInputField = ({
  InputComponent,
  inputFieldProps,
  hasError,
  errorText,
  fieldLabel
}) => (
  <FormControl isInvalid={hasError}>
    <VStack spacing="4px" alignItems="flex-start">
      {fieldLabel ? <Text textStyle="body-medium">{fieldLabel}</Text> : ''}
      {InputComponent || (
        <Input
          type="text"
          borderWidth="1px"
          borderColor={hasError ? 'red.300' : ''}
          {...inputFieldProps}
        />
      )}
      {errorText ? <FormErrorMessage>{errorText}</FormErrorMessage> : ''}
    </VStack>
  </FormControl>
);
export default FormInputField;
