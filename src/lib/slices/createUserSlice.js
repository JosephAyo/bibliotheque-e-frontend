import { isEmpty, merge } from 'lodash';

const defaultState = {
  first_name: '',
  last_name: '',
  email: '',
  is_email_verified: false,
  is_verified: false,
  user_role_associations: [],
  current_role_id: ''
};

const createUserSlice = (set) => ({
  currentUser: defaultState,
  setCurrentUser: (currentUser) => {
    console.log('currentUser :>> ', currentUser);
    set((state) => ({
      userSlice: {
        ...state.userSlice,
        currentUser: isEmpty(currentUser)
          ? defaultState
          : merge(state.userSlice.currentUser, currentUser)
      }
    }));
  }
});

export default createUserSlice;
