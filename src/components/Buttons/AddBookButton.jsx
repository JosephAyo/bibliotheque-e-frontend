import { IconButton } from '@chakra-ui/react';
import { BsPlusCircleFill } from 'react-icons/bs';

const AddBookButton = ({ onClick }) => (
  <IconButton
    width="155px"
    height="220px"
    borderStyle="dashed"
    borderRadius="18px"
    borderWidth="2px"
    onClick={onClick}
    icon={<BsPlusCircleFill size={32} />}
  />
);

export default AddBookButton;
