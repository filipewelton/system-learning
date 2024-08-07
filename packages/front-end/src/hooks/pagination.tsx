'use client'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

import { fetchApi } from '__utils/api'

type Context = 'instructors' | 'students'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
})

export function PaginationProvider(props: Props) {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  )
}

async function getResultPageCount(context: Context) {
  const response = await fetchApi(`${context}/count`, {
    method: 'GET',
  })

  if (response.status !== 200) return 1

  const json = await response.json()

  return json.pageCount as number
}

export function usePagination(context: Context) {
  return useQuery({
    queryKey: [context],
    initialData: 1,
    queryFn: () => getResultPageCount(context),
  })
}
