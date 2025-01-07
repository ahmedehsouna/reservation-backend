import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("guests", (table) => {
    table.increments("id");
    table.string("name");
    table.string("email").unique();
    table.string("phone_number").unique();
    table.boolean("active").defaultTo(true);
    table.timestamps(true,true);

  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("guests");
}
