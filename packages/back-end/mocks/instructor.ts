import { faker } from '@faker-js/faker'

import { InstructorCreation } from '__application/interfaces/instructor'

export function mockInstructorData(): InstructorCreation {
  return {
    email: faker.internet.email(),
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
    bio: faker.lorem.words(),
  }
}
