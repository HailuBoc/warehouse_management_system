import { useQuery } from '@tanstack/react-query';
import { shortageApi } from '../api/shortages.js';

export const SHORTAGES_QUERY_KEY = ['shortages'];

export const useShortages = () => {
  return useQuery({
    queryKey: SHORTAGES_QUERY_KEY,
    queryFn: shortageApi.getShortages,
    staleTime: 1000 * 30, // 30 seconds — stays fresh after transfers
  });
};
