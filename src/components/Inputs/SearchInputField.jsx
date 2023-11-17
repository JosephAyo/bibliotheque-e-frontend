import { Input, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const SearchInputField = ({ inputFieldProps, fieldLabel, containerProps }) => {
  const inputBackground = useColorModeValue('#f6f6f6', 'gray.600');
  return (
    <VStack spacing="4px" alignItems="flex-start" {...containerProps}>
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

export default SearchInputField;
