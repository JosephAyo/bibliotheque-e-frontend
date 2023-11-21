import { isEmpty, merge } from 'lodash';

const defaultState = {
  is_logged_in: false,
  first_name: '',
  last_name: '',
  email: '',
  is_email_verified: false,
  is_verified: false,
  user_role_associations: [],
  current_role_id: '',
  not_set: true
};

const createUserSlice = (set) => ({
  currentUser: defaultState,
  setCurrentUser: (currentUser) => {
    set((state) => {
      const update = isEmpty(currentUser)
        ? { ...defaultState, not_set: false }
        : merge(state.userSlice.currentUser, currentUser, {
            is_logged_in: true,
            not_set: false
          });
      if (isEmpty(currentUser)) update.user_role_associations = currentUser.user_role_associations;
      return {
        userSlice: {
          ...state.userSlice,
          currentUser: update
        }
      };
    });
  },
  clearCurrentUser: () => {
    set((state) => ({
      userSlice: {
        ...state.userSlice,
        currentUser: { ...defaultState, not_set: false }
      }
    }));
  }
});

export default createUserSlice;
