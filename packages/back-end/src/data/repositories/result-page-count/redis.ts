import {
  Contexts,
  ResultPageCountRepository,
} from '__application/interfaces/result-page-count'
import {
  INSTRUCTOR_RESULTS_PAGE_COUNT,
  STUDENT_RESULTS_PAGE_COUNT,
} from '__domain/constants/cached-key-names'
import { ITEMS_PER_PAGE } from '__domain/constants/database-query-pagination'
import { cache } from '__providers/cache'
import { database } from '__providers/database'

const cacheKeys = {
  instructor: INSTRUCTOR_RESULTS_PAGE_COUNT,
  student: STUDENT_RESULTS_PAGE_COUNT,
}

export class RedisResultPageCountRepository
  implements ResultPageCountRepository
{
  async increaseResultPageCount(context: Contexts): Promise<void> {
    await cache.select(0)

    const cacheKey = cacheKeys[context]
    const rowCount = await this.getRowCount(cacheKey)
    const pageCount = this.calculatePageCount(rowCount)

    await cache.hset(cacheKey, {
      rowCount: rowCount.toString(),
      pageCount: pageCount.toString(),
    })
  }

  private async getRowCount(key: string) {
    return await cache
      .hget(key, 'rows')
      .then((value) => (!value ? 0 : parseInt(value)))
      .then(async (value) => {
        if (value > 0) return value

        const count = await database('Instructors')
          .first()
          .count()
          .then((result) => result['count(*)'])

        if (typeof count === 'number') return count

        return Number(count)
      })
  }

  private calculatePageCount(rowCount: number) {
    if (rowCount <= ITEMS_PER_PAGE) return 1

    const mod = rowCount % ITEMS_PER_PAGE
    const diffIncrease = mod === 0 ? mod : 1
    const pageCount = (rowCount - mod) / ITEMS_PER_PAGE + diffIncrease

    return pageCount
  }

  async getResultPageCount(context: Contexts): Promise<number> {
    const cacheKey = cacheKeys[context]

    const count = await cache
      .hget(cacheKey, 'pageCount')
      .then((result) => (!result ? 0 : parseInt(result)))

    return count
  }
}
