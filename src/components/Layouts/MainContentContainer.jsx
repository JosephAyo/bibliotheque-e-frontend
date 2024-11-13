import { Flex } from '@chakra-ui/react';
import DueSoonReminderBanners from '../Banners/DueSoonReminderBanners';

const MainContentContainer = ({ children }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    maxWidth="893px"
    marginLeft="auto"
    marginRight="auto"
    paddingY="20px"
    paddingX="23px"
    rowGap="20px">
    {children}

    <DueSoonReminderBanners />
  </Flex>
);

export default MainContentContainer;
