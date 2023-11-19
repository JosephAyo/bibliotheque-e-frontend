import useCurrentUser from 'hooks/useCurrentUser';

const UserAuthWrapper = ({ children }) => {
  useCurrentUser();

  return children;
};

export default UserAuthWrapper;
