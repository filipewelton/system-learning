import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Instructors', (builder) => {
    builder.string('id', 26).primary().notNullable()
    builder.string('name', 50).notNullable()
    builder.string('email').notNullable().unique()
    builder.string('bio', 255)
    builder.string('avatar').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Instructors')
}
