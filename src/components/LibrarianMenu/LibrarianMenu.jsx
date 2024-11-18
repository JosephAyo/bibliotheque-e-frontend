import { Menu, MenuButton, MenuList, MenuItem, IconButton, MenuDivider, MenuOptionGroup } from '@chakra-ui/react';
import Link from 'next/link';
import { BsGearFill } from 'react-icons/bs';

const LibrarianMenu = () => (
  <Menu>
    <MenuButton rounded="100%" as={IconButton} aria-label="User" icon={<BsGearFill />} />
    <MenuList minWidth="160px" zIndex={4}>
      <MenuOptionGroup title="Admin Menu" type="radio" textStyle="body-bold" marginX="12px">
        <MenuDivider />
        <MenuItem as={Link} href="/users/manage" textStyle="caption-medium">
          Users
        </MenuItem>
        <MenuItem as={Link} href="/borrowed-books/manage" textStyle="caption-medium">
          Borrowed books
        </MenuItem>
        <MenuItem as={Link} href="/genres/manage" textStyle="caption-medium">
          Genres
        </MenuItem>
        <MenuItem as={Link} href="/curations" textStyle="caption-medium">
          Curations
        </MenuItem>
      </MenuOptionGroup>
    </MenuList>
  </Menu>
);

export default LibrarianMenu;
