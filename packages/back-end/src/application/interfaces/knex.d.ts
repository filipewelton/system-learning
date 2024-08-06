import 'knex'

import { Instructor } from '__data/schemas/instructor'

declare module 'knex/types/tables' {
  interface Tables {
    Instructors: Instructor
  }
}
