import { faker } from '@faker-js/faker'

import { InstructorCreation } from '__application/interfaces/instructor'

export function mockInstructorData(): InstructorCreation {
  const firstName = faker.person.firstName().replace(/^\w/, (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })

  const lastName = faker.person.lastName().replace(/^\w/, (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })

  return {
    email: faker.internet.email(),
    name: `${firstName} ${lastName}`,
    bio: faker.lorem.words(),
  }
}
