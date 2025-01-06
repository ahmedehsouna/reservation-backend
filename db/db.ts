import knex from "knex";

import knexfile from "./knexfile";

// @ts-ignore
export const db = knex(knexfile.development);
// export const Guest = () => db("guests");
// export const Reservation = () => db("reservations");
// export const Room = () => db("rooms");
