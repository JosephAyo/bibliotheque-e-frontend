import { IconButton, useColorMode } from '@chakra-ui/react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';

const ThemeToggleButton = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      rounded="100%"
      position="absolute"
      top="20px"
      right="20px"
      icon={colorMode === 'dark' ? <BsSunFill /> : <BsMoonFill />}
    />
  );
};

export default ThemeToggleButton;
