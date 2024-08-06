import { database } from '__providers/database'

async function run() {
  await database('Instructors')
    .delete()
    .finally(() => process.exit(0))
}

run()
