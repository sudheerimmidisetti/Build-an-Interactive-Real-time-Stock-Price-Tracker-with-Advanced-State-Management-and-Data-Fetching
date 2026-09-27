import { useQuery } from '@tanstack/react-query'
import { fetchStockQuote } from '../api/stockService'

export function useStockQuote(symbol) {
  return useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: () => fetchStockQuote(symbol),
    enabled: !!symbol,
    refetchInterval: 10_000,
    staleTime: 5_000,
    gcTime: 5 * 60_000,
  })
}
