import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';

const ItemLayoutSwitchButton = ({ tileView, onClick }) => (
  <IconButton
    colorScheme="primary"
    variant="outline"
    marginLeft="auto"
    icon={tileView ? <FaThList /> : <BsFillGrid3X3GapFill />}
    onClick={onClick}
  />
);

export default ItemLayoutSwitchButton;
