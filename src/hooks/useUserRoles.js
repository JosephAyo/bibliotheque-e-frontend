import { useQuery } from '@tanstack/react-query';
import useAppStore from '@/lib/store';
import { get } from 'lodash';
import { useMemo } from 'react';
import { viewRoles } from '@/services/api/queries/users';
import { USER_ROLES } from '@/utils/constants';
import { getAxiosResponseBody, getOr } from '@/utils/objects';

const useUserRoles = () => {
  const {
    userSlice: { currentUser }
  } = useAppStore();

  const { isLibrarian, isProprietor, isBorrower, currentUserRoleName } = useMemo(() => {
    const userRoleName = get(
      currentUser.user_role_associations.find(
        (user_role_association) => user_role_association.role_id === currentUser.current_role_id
      ),
      'role.name',
      null
    );

    return {
      isLibrarian: userRoleName === USER_ROLES.LIBRARIAN,
      isProprietor: userRoleName === USER_ROLES.PROPRIETOR,
      isBorrower: userRoleName === USER_ROLES.BORROWER,
      currentUserRoleName: userRoleName
    };
  }, [currentUser.current_role_id, currentUser.user_role_associations]);

  const { data } = useQuery({
    enabled: isLibrarian,
    queryKey: ['viewRoles'],
    queryFn: viewRoles
  });

  const resBody = getAxiosResponseBody(data);

  return {
    roles: get(resBody, 'data', []).map((role) => ({ ...role, value: role.id, label: role.name })),
    isLibrarian,
    isProprietor,
    isBorrower,
    librarianRoleId: get(
      getOr(resBody, 'data', []).find((role) => role.name === USER_ROLES.LIBRARIAN),
      'id',
      null
    ),
    proprietorRoleId: get(
      getOr(resBody, 'data', []).find((role) => role.name === USER_ROLES.PROPRIETOR),
      'id',
      null
    ),
    borrowerRoleId: get(
      getOr(resBody, 'data', []).find((role) => role.name === USER_ROLES.BORROWER),
      'id',
      null
    ),
    currentUserRoleName
  };
};

export default useUserRoles;
