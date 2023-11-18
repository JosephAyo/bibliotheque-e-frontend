import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const RouterReadyWrapper = ({ children }) => {
  const router = useRouter();
  const [routerReady, setRouterReady] = useState(false);

  useEffect(() => {
    setRouterReady(router.isReady);
  }, [router.isReady]);

  return !routerReady ? <div>Loading</div> : children;
};

export default RouterReadyWrapper;
