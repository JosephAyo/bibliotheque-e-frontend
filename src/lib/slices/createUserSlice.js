import { isEmpty, merge } from 'lodash';

const defaultState = {
  is_logged_in: false,
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
    set((state) => ({
      userSlice: {
        ...state.userSlice,
        currentUser: isEmpty(currentUser)
          ? defaultState
          : merge(state.userSlice.currentUser, currentUser, { is_logged_in: true })
      }
    }));
  },
  clearCurrentUser: () => {
    console.log('hitƒ');
    set((state) => ({
      userSlice: {
        ...state.userSlice,
        currentUser: defaultState
      }
    }));
  }
});

export default createUserSlice;
