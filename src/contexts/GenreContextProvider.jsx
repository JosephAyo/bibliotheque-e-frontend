import { viewGenres } from '@/services/api/queries/genre';
import { getOr } from '@/utils/objects';
import { useQuery } from '@tanstack/react-query';
import { createContext } from 'react';

export const GenreContext = createContext(null);

const GenreContextProvider = ({ children }) => {
  const { data } = useQuery({
    queryKey: ['viewGenres'],
    queryFn: viewGenres,
    refetchOnWindowFocus: true
  });

  return (
    <GenreContext.Provider
      value={getOr(data, 'data', []).map((item) => ({
        ...item,
        value: item.id,
        label: item.name
      }))}>
      {children}
    </GenreContext.Provider>
  );
};

export default GenreContextProvider;
