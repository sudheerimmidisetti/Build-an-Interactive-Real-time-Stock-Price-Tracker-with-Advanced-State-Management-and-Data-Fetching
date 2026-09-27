import { useQuery } from '@tanstack/react-query'
import { fetchHistoricalData } from '../api/stockService'

export function useHistoricalData(symbol) {
  return useQuery({
    queryKey: ['historicalData', symbol],
    queryFn: () => fetchHistoricalData(symbol),
    enabled: !!symbol,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
  })
}
