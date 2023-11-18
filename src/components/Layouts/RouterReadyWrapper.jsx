import { useRouter } from 'next/router';

const RouterReadyWrapper = ({ children }) => {
  const router = useRouter();
  return !router.isReady ? 'Loading' : children;
};

export default RouterReadyWrapper;
