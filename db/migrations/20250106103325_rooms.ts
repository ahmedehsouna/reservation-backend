import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    return knex.schema.createTable("rooms", (table) => {
        table.increments("id");
        table.string("number");
        table.string("name");
        table.boolean("active").defaultTo(true);
        table.timestamps(true,true);

      });

}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("rooms");

}

