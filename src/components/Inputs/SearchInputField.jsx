import { Input, Text, VStack } from '@chakra-ui/react';

const SearchInputField = ({ inputFieldProps, fieldLabel, containerProps }) => (
  <VStack spacing="4px" alignItems="flex-start" {...containerProps}>
    {fieldLabel ? <Text textStyle="body-medium">{fieldLabel}</Text> : ''}
    <Input
      type="text"
      borderWidth="1px"
      backgroundColor="#f6f6f620"
      color="white"
      borderColor="whiteAlpha.600"
      _focus={{
        outlineWidth: '0px'
      }}
      _active={{
        outlineWidth: '0px'
      }}
      _focusVisible={{
        outlineWidth: '0px'
      }}
      _placeholder={{
        color: '#aaa'
      }}
      {...inputFieldProps}
    />
  </VStack>
);

export default SearchInputField;
