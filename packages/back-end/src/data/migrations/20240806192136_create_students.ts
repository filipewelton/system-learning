import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Students', (builder) => {
    builder.string('id', 26).primary().notNullable()
    builder.string('name', 50).notNullable()
    builder.string('email').notNullable().unique()
    builder.string('avatar').notNullable()
    builder.boolean('isPaying').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Students')
}
