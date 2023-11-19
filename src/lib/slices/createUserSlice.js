import { isEmpty } from 'lodash';

const defaultState = {
  first_name: '',
  last_name: '',
  email: '',
  is_email_verified: false,
  is_verified: false,
  user_role_associations: []
};

const createUserSlice = (set) => ({
  currentUser: defaultState,
  setCurrentUser: (currentUser) => {
    set((state) => ({
      userSlice: {
        ...state.userSlice,
        currentUser: isEmpty(currentUser) ? defaultState : currentUser
      }
    }));
  }
});

export default createUserSlice;
