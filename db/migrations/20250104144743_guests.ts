import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("guests", (table) => {
    table.increments("id");
    table.string("name");
    table.string("email");
    table.string("phone_number");
    table.boolean("active").defaultTo(true);
    table.timestamps(true,true);

  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("guests");
}
