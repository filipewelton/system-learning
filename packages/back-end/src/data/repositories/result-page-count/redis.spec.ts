import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { INSTRUCTOR_RESULTS_PAGE_COUNT } from '__domain/constants/cached-key-names'
import { cache } from '__providers/cache'

import { RedisResultPageCountRepository } from './redis'

let sut: RedisResultPageCountRepository

beforeEach(() => {
  sut = new RedisResultPageCountRepository()
})

afterAll(async () => {
  await cache.flushall()
})

describe('Result count increase', () => {
  it('should be possible to increase the result page count in instructor context', async () => {
    await sut.increaseResultPageCount('instructor')

    const key = await cache.keys(INSTRUCTOR_RESULTS_PAGE_COUNT)

    expect(key).toContain(INSTRUCTOR_RESULTS_PAGE_COUNT)
  })
})

describe('Getting page count', () => {
  it('should be possible to get page count from instructor context', async () => {
    const pageCount = await sut.getResultPageCount('instructor')
    expect(pageCount).toBeTypeOf('number')
  })
})
