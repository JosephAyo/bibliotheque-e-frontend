import { Button } from '@chakra-ui/react';

const AuthFormActionButton = ({ children }) => (
  <Button colorScheme="actionPrimary" width="100%" color="white">
    {children}
  </Button>
);

export default AuthFormActionButton;
