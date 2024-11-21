import { Center, Spinner } from '@chakra-ui/react';
import useAppStore from '@/lib/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getOr } from '@/utils/objects';
import UserAuthWrapper from './UserAuthWrapper';

const AuthorizationGate = ({ children, permittedRoles }) => {
  const router = useRouter();
  const {
    userSlice: { currentUser }
  } = useAppStore();

  const currentRoleName = getOr(
    currentUser.user_role_associations.find(
      (user_role_association) => user_role_association.role_id === currentUser.current_role_id
    ),
    'role.name',
    null
  );
  const isAuthorized = (permittedRoles || []).includes(currentRoleName);

  useEffect(() => {
    if (!isAuthorized && currentUser.not_set) router.push('/logout');
  }, [router, isAuthorized, currentUser.not_set]);

  return !isAuthorized ? (
    <Center height="400px">
      <Spinner color="primary.500" />
    </Center>
  ) : (
    children
  );
};

const AuthorizationGateComponent = (props) => (
  <UserAuthWrapper>
    <AuthorizationGate {...props} />
  </UserAuthWrapper>
);
export default AuthorizationGateComponent;
