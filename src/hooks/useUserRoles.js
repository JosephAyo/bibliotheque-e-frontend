import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import { viewRoles } from 'services/api/queries/users';
import { USER_ROLES } from 'utils/constants';
import { getAxiosResponseBody, getOr } from 'utils/objects';

const useUserRoles = () => {
  const { data } = useQuery({ queryKey: ['viewRoles'], queryFn: viewRoles });

  const resBody = getAxiosResponseBody(data);

  return {
    roles: get(resBody, 'data', null),
    librarianRoleId: get(
      getOr(resBody, 'data', []).find((role) => role.name === USER_ROLES.LIBRARIAN),
      'id',
      null
    )
  };
};

export default useUserRoles;
