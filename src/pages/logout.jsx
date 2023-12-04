import { Text } from '@chakra-ui/react';
import { clearAllUserData } from '@/config/axios';
import useAppStore from '@/lib/store';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

const Logout = () => {
  const router = useRouter();
  const {
    userSlice: { clearCurrentUser }
  } = useAppStore();

  const handleClearCurrentUser = useCallback(() => clearCurrentUser(), [clearCurrentUser]);

  useEffect(() => {
    clearAllUserData();
    handleClearCurrentUser();
    router.push('/');
  }, [router, handleClearCurrentUser]);

  return <Text textStyle="headline-5-medium">Logging out...</Text>;
};

export default Logout;
