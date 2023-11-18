import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Books = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return <Text textStyle="headline-5-medium">Logging out...</Text>;
};

export default Books;
