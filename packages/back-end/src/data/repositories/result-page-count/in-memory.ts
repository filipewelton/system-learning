import {
  Contexts,
  ResultPageCountRepository,
} from '__application/interfaces/result-page-count'
import {
  STUDENT_RESULTS_PAGE_COUNT,
  INSTRUCTOR_RESULTS_PAGE_COUNT,
} from '__domain/constants/cached-key-names'

const keys = {
  instructor: INSTRUCTOR_RESULTS_PAGE_COUNT,
  student: STUDENT_RESULTS_PAGE_COUNT,
}

export class InMemoryResultPageCountRepository
  implements ResultPageCountRepository
{
  private cache = new Map<string, number>([
    [INSTRUCTOR_RESULTS_PAGE_COUNT, 0],
    [STUDENT_RESULTS_PAGE_COUNT, 0],
  ])

  async increaseResultPageCount(context: Contexts): Promise<void> {
    const key = keys[context]
    const currentCount = this.cache.get(key) ?? 0

    this.cache.set(key, currentCount + 1)
  }

  async getResultPageCount(context: Contexts): Promise<number> {
    const key = keys[context]
    return this.cache.get(key) ?? 0
  }
}
