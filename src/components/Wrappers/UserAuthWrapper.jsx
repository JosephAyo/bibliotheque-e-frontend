import useCurrentUserLoader from '@/hooks/useCurrentUserLoader';

const UserAuthWrapper = ({ children }) => {
  useCurrentUserLoader();

  return children;
};

export default UserAuthWrapper;
