import { create } from 'zustand';
import createUserSlice from './slices/createUserSlice';

const useAppStore = create()((...a) => ({
  userSlice: createUserSlice(...a)
}));

export default useAppStore;
