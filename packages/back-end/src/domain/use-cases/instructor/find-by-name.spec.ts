import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryInstructorRepository } from '__data/repositories/instructor/in-memory'
import { ITEMS_PER_PAGE } from '__domain/constants/database-query-pagination'
import { mockInstructorData } from '__mocks/instructor'

import { FindInstructorsByName } from './find-by-name'

let instructorRepository: InMemoryInstructorRepository
let sut: FindInstructorsByName

describe('Instructor search by name', () => {
  beforeEach(() => {
    instructorRepository = new InMemoryInstructorRepository()
    sut = new FindInstructorsByName(instructorRepository)
  })

  it('should be possible to find results from the first page', async () => {
    await instructorRepository.create({
      ...mockInstructorData(),
      name: 'John Doe',
    })

    await instructorRepository.create({
      ...mockInstructorData(),
      name: 'Jane Doe',
    })

    const { instructors } = await sut.call({
      name: 'Doe',
      page: 1,
    })

    expect(instructors.length).toBeGreaterThanOrEqual(2)
  })

  it('should be possible to find results from the second page', async () => {
    const lastName = faker.person.lastName()

    const names = Array.from(new Array(ITEMS_PER_PAGE + 1)).map(() => {
      return `${faker.person.firstName()} ${lastName}`
    })

    for await (const name of names) {
      await instructorRepository.create({
        ...mockInstructorData(),
        name,
      })
    }

    const { instructors } = await sut.call({
      name: lastName,
      page: 2,
    })

    expect(instructors.length).toBeGreaterThanOrEqual(1)
  })

  it("shouldn't be possible to find when there are no matches", async () => {
    const { instructors } = await sut.call({
      name: 'Jeff Musk',
      page: 1,
    })

    expect(instructors).toHaveLength(0)
  })
})
