import { Button } from '@chakra-ui/react';

const AuthFormActionButton = ({ children, ...rest }) => (
  <Button colorScheme="actionPrimary" width="100%" color="white" {...rest}>
    {children}
  </Button>
);

export default AuthFormActionButton;
