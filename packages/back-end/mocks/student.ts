import { faker } from '@faker-js/faker'

export function mockStudentData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }
}
