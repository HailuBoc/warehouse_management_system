import { useQuery } from '@tanstack/react-query';
import { shortageApi } from '../api/shortages.js';

const SHORTAGES_QUERY_KEY = ['shortages'];

export const useShortages = () => {
  return useQuery({
    queryKey: SHORTAGES_QUERY_KEY,
    queryFn: shortageApi.getShortages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
