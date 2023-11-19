import { useQuery } from '@tanstack/react-query';
import useAppStore from 'lib/store';
import { get } from 'lodash';
import { useCallback, useEffect } from 'react';
import { viewProfile } from 'services/api/queries/users';
import { getAxiosResponseBody } from 'utils/objects';

const useCurrentUser = () => {
  const {
    userSlice: { setCurrentUser, currentUser }
  } = useAppStore();

  const { data } = useQuery({ queryKey: ['viewProfile'], queryFn: viewProfile });

  const handleSetCurrentUser = useCallback(
    (userData) => {
      setCurrentUser(userData);
    },
    [setCurrentUser]
  );

  useEffect(() => {
    const resBody = getAxiosResponseBody(data);
    handleSetCurrentUser(get(resBody, 'data', null));
  }, [data, handleSetCurrentUser]);

  return { currentUser };
};

export default useCurrentUser;
