import { env } from '__configs/environment'

export const ITEMS_PER_PAGE = env.NODE_ENV === 'test' ? 2 : 18
