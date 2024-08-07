export async function fetchApi(url: string, options: RequestInit) {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
  return await fetch(`${NEXT_PUBLIC_API_URL}/${url}`, options)
}
