import { Box, Text } from '@chakra-ui/react';

const UserInfo = ({ label, detail }) => (
  <Box width="251px">
    <Text textStyle="body-medium" textTransform="capitalize" marginBottom="5px">
      {label}
    </Text>
    <Box as="span" textStyle="caption">
      {detail}
    </Box>
  </Box>
);

export default UserInfo;
