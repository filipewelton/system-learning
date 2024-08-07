import { faker } from '@faker-js/faker'

export function mockStudentData() {
  const firstName = faker.person.firstName().replace(/^\w/, (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })

  const lastName = faker.person.lastName().replace(/^\w/, (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })

  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email(),
  }
}
