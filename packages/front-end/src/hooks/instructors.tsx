'use client'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

import { fetchApi } from '__utils/api'

const oneHourInMilliseconds = 1000 * 60 * 60

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: oneHourInMilliseconds,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
})

export function InstructorProvider(props: Props) {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  )
}

async function getInstructors(page: number) {
  const response = await fetchApi(`instructors?page=${page}`, {
    method: 'GET',
  })

  if (response.status !== 200) return []

  const json = await response.json()

  return json.instructors as Instructor[]
}

export function useInstructors(page?: number) {
  return useQuery({
    queryKey: ['instructors', page || 1],
    initialData: null,
    enabled: false,
    queryFn: () => getInstructors(page || 1),
  })
}
