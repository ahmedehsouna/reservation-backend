import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    return knex.schema.createTable("rooms_reservations", (table) => {
        table.increments("id");
        table.integer('reservation_id').references('id').inTable('reservations');
        table.integer('room_id').references('id').inTable('rooms');
        table.boolean("active").defaultTo(true);
        table.timestamps(true,true);
      });

}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("rooms_reservations");

}

