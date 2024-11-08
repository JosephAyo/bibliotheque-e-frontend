import { GenreContext } from '@/contexts/GenreContextProvider';
import { useContext } from 'react';


export default function useGenreContext() {
  const context = useContext(GenreContext);

  if (!context) {
    throw new Error('useGenreContext must be used within a GenreContextProvider');
  }

  return context;
}
