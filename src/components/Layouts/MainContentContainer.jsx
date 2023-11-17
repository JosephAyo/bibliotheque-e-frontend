import { Flex } from '@chakra-ui/react';

const MainContentContainer = ({ children }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    maxWidth="893px"
    marginLeft="auto"
    marginRight="auto"
    paddingY="20px"
    paddingX="23px">
    {children}
  </Flex>
);

export default MainContentContainer;
