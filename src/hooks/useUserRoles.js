import { useQuery } from '@tanstack/react-query';
import useAppStore from 'lib/store';
import { get } from 'lodash';
import { useMemo } from 'react';
import { viewRoles } from 'services/api/queries/users';
import { USER_ROLES } from 'utils/constants';
import { getAxiosResponseBody, getOr } from 'utils/objects';

const useUserRoles = () => {
  const {
    userSlice: { currentUser }
  } = useAppStore();

  const isLibrarian = useMemo(() => {
    const currentUserRoleName = get(
      currentUser.user_role_associations.find(
        (user_role_association) => user_role_association.role_id === currentUser.current_role_id
      ),
      'role.name',
      null
    );

    return currentUserRoleName === USER_ROLES.LIBRARIAN;
  }, [currentUser.current_role_id, currentUser.user_role_associations]);

  const { data } = useQuery({
    enabled: isLibrarian,
    queryKey: ['viewRoles'],
    queryFn: viewRoles
  });

  const resBody = getAxiosResponseBody(data);

  return {
    roles: get(resBody, 'data', []).map((role) => ({ ...role, value: role.id, label: role.name })),
    librarianRoleId: get(
      getOr(resBody, 'data', []).find((role) => role.name === USER_ROLES.LIBRARIAN),
      'id',
      null
    )
  };
};

export default useUserRoles;
