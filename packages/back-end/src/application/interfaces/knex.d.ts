import 'knex'

import { Instructor } from '__data/schemas/instructor'
import { Student } from '__data/schemas/student'

declare module 'knex/types/tables' {
  interface Tables {
    Instructors: Instructor
    Students: Student
  }
}
