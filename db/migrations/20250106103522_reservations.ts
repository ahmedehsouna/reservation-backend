import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    return knex.schema.createTable("reservations", (table) => {
        table.increments("id");
        table.dateTime("start");
        table.dateTime("end");
        table.integer('guest_id').references('id').inTable('guests');
        table.boolean("active").defaultTo(true);
        table.timestamps(true,true);
      });

}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("reservations");

}

