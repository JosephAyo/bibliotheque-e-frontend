import {
  FormControl,
  FormErrorMessage,
  HStack,
  PinInput,
  PinInputField,
  VStack
} from '@chakra-ui/react';
import React from 'react';

const OtpInputField = ({ value, hasError, errorText, onChange }) => (
  <FormControl isInvalid={hasError}>
    <VStack>
      <HStack>
        <PinInput otp isInvalid={hasError} onChange={onChange} value={value}>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      {errorText ? <FormErrorMessage>{errorText}</FormErrorMessage> : ''}
    </VStack>
  </FormControl>
);

export default OtpInputField;
