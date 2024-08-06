import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryInstructorRepository } from '__data/repositories/instructor/in-memory'
import { ITEMS_PER_PAGE } from '__domain/constants/database-query-pagination'
import { mockInstructorData } from '__mocks/instructor'

import { FindAllInstructors } from './find-all'

let instructorRepository: InMemoryInstructorRepository
let sut: FindAllInstructors

describe('Instructor listing', () => {
  beforeEach(() => {
    instructorRepository = new InMemoryInstructorRepository()
    sut = new FindAllInstructors(instructorRepository)
  })

  it('should be possible to find all instructors from the first page', async () => {
    const dataList = Array.from(new Array(ITEMS_PER_PAGE)).map(() =>
      mockInstructorData(),
    )

    for await (const data of dataList) {
      await instructorRepository.create(data)
    }

    const { instructors } = await sut.call(1)

    expect(instructors.length).toBeGreaterThanOrEqual(2)

    expect(instructors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          avatar: expect.any(String),
          bio: null,
          email: expect.any(String),
          id: expect.any(String),
          name: expect.any(String),
        }),
      ]),
    )
  })

  it('should be possible to find all instructors from the second page', async () => {
    const dataList = Array.from(new Array(ITEMS_PER_PAGE + 1)).map(() =>
      mockInstructorData(),
    )

    for await (const data of dataList) {
      await instructorRepository.create(data)
    }

    const { instructors } = await sut.call(2)

    expect(instructors.length).toBeGreaterThanOrEqual(1)

    expect(instructors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          avatar: expect.any(String),
          bio: null,
        }),
      ]),
    )
  })
})
