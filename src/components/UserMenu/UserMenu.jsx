import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuOptionGroup,
  Radio,
  RadioGroup,
  VStack,
  MenuDivider
} from '@chakra-ui/react';
import useUserRoles from 'hooks/useUserRoles';
import useAppStore from 'lib/store';
import { get } from 'lodash';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { getOr } from 'utils/objects';

const UserMenu = () => {
  const {
    userSlice: { currentUser, setCurrentUser }
  } = useAppStore();

  const { isLibrarian } = useUserRoles();

  const current_role_id = getOr(
    currentUser,
    'current_role_id',
    getOr(currentUser, 'user_role_associations.0.role_id', null)
  );

  return (
    <Menu>
      <MenuButton rounded="100%" as={IconButton} aria-label="User" icon={<FaUserCircle />} />
      <MenuList minWidth="160px" zIndex={4}>
        {get(currentUser, 'is_logged_in', false) ? (
          <>
            <MenuItem as={Link} href="/users/account" textStyle="caption-medium">
              Profile settings
            </MenuItem>
            <MenuDivider />
            <MenuOptionGroup
              title="Account type"
              type="radio"
              textStyle="caption-medium"
              marginX="12px">
              <RadioGroup
                value={current_role_id}
                onChange={(value) => setCurrentUser({ current_role_id: value })}>
                <VStack
                  alignItems="flex-start"
                  textStyle="caption"
                  textTransform="capitalize"
                  marginLeft="12px">
                  {getOr(currentUser, 'user_role_associations', []).map((useRoleAssociation) => {
                    const { role } = useRoleAssociation;
                    return (
                      <Radio key={role.id} value={role.id} size="sm">
                        {role.name}
                      </Radio>
                    );
                  })}
                </VStack>
              </RadioGroup>
            </MenuOptionGroup>
            {isLibrarian ? (
              <>
                <MenuDivider />
                <MenuItem as={Link} href="/users/manage" textStyle="caption-medium">
                  Manage users
                </MenuItem>
              </>
            ) : (
              ''
            )}
            <MenuDivider />
            <MenuItem as={Link} href="/logout" textStyle="caption-medium">
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem as={Link} href="/login" textStyle="caption-medium">
            Login
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
