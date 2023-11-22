import { Box, Button } from '@chakra-ui/react';

const FilterBooksButton = ({ children, onClick, isActive }) => (
  <Box textStyle="caption">
    <Button
      height="26px"
      borderRadius="8px"
      paddingX="8px"
      fontSize="inherit"
      variant={isActive ? 'primary_action' : ''}
      onClick={onClick}>
      {children}
    </Button>
  </Box>
);

export default FilterBooksButton;
