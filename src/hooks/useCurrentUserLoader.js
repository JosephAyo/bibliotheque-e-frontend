import { useQuery } from '@tanstack/react-query';
import { getStoredRoleId } from 'config/axios';
import useAppStore from 'lib/store';
import { get } from 'lodash';
import { useCallback, useEffect } from 'react';
import { viewProfile } from 'services/api/queries/users';
import { getAxiosResponseBody, getOr } from 'utils/objects';

const useCurrentUserLoader = () => {
  const {
    userSlice: { setCurrentUser, currentUser }
  } = useAppStore();

  const { data } = useQuery({ queryKey: ['viewProfile'], queryFn: viewProfile });

  const handleSetCurrentUser = useCallback(
    (userData) => {
      if (userData) {
        const firstRoleId = getOr(userData, 'user_role_associations.0.role_id', null);
        // const current_role_id = firstRoleId === getStoredRoleId() ? firstRoleId : getStoredRoleId();
        const storedRoleId = getStoredRoleId();
        const current_role_id = getOr(
          getOr(userData, 'user_role_associations', []).find(
            (user_role_association) => user_role_association.role_id === storedRoleId
          ),
          'role_id',
          firstRoleId
        );
        setCurrentUser({ ...userData, current_role_id });
      }
    },
    [setCurrentUser]
  );

  useEffect(() => {
    const resBody = getAxiosResponseBody(data);
    handleSetCurrentUser(get(resBody, 'data', null));
  }, [data, handleSetCurrentUser]);

  return { currentUser };
};

export default useCurrentUserLoader;
