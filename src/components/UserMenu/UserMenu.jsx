import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuOptionGroup,
  MenuItemOption
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

const userRoles = [
  { name: 'borrower', description: 'borrower', id: 'a7da631c-45e4-4490-9569-b92cb5c52654' },
  {
    name: 'proprietor',
    description: 'proprietor',
    id: '10cd2c32-5355-4668-be92-0d34e653f5d3'
  },
  {
    name: 'librarian',
    description: 'librarian',
    id: '633d9319-f661-4452-9173-110fcaacf2cb'
  }
];
const UserMenu = () => (
  <Menu closeOnSelect={false}>
    <MenuButton rounded="100%" as={IconButton} aria-label="User" icon={<FaUserCircle />} />
    <MenuList>
      <MenuItem as={Link} href="/users/account" textStyle="caption-medium">
        Profile settings
      </MenuItem>
      <MenuOptionGroup
        title="Account type"
        type="radio"
        textStyle="caption-medium"
        defaultValue={userRoles[0].id}
        marginX="12px">
        {userRoles.map((role) => (
          <MenuItemOption
            key={role.id}
            value={role.id}
            textStyle="caption-medium"
            textTransform="capitalize">
            {role.name}
          </MenuItemOption>
        ))}
      </MenuOptionGroup>
    </MenuList>
  </Menu>
);

export default UserMenu;
