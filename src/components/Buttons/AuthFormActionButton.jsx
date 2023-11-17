import { Button } from '@chakra-ui/react';

const AuthFormActionButton = ({ children, ...rest }) => (
  <Button variant="primary_action" width="100%" {...rest}>
    {children}
  </Button>
);

export default AuthFormActionButton;
