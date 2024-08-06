import { PostgresInstructorRepository } from '__data/repositories/instructor/postgresql'
import { RedisResultPageCountRepository } from '__data/repositories/result-page-count/redis'
import { ITEMS_PER_PAGE } from '__domain/constants/database-query-pagination'
import { CreateInstructor } from '__domain/use-cases/instructor/create'
import { mockInstructorData } from '__mocks/instructor'

const instructorRepository = new PostgresInstructorRepository()
const resultPageCountRepository = new RedisResultPageCountRepository()

const createInstructor = new CreateInstructor(
  instructorRepository,
  resultPageCountRepository,
)

export async function seed(): Promise<void> {
  const data = Array.from(new Array(ITEMS_PER_PAGE + 1)).map(() =>
    mockInstructorData(),
  )

  for await (const d of data) {
    await createInstructor.call(d)
  }
}
