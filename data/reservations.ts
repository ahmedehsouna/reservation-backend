import { db } from "../db/db";

const limit = 30;

export class ReservationsData {
  async get_guest_past_reservations(id: string) {
    return await db("reservations")
      .where({ active: true, guest_id: id })
      .where("end", "<=", new Date())
      .count()
      .first();
  }

  async index(offset: number) {
    let promise: any = await Promise.all([
      db("reservations").where({ active: true }).offset(offset).limit(limit),
      db("reservations").where({ active: true }).count().first(),
    ]);

    await Promise.all([
      Promise.all(
        promise[0].map(async (reservation: any) => {
          reservation["rooms"] =
            (await db("rooms_reservations")
              .where("rooms_reservations.reservation_id", reservation.id)
              .where("rooms_reservations.active", true)
              .where("rooms.active", true)
              .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")) ||
            [];
          return reservation;
        })
      ),
      Promise.all(
        promise[0].map(async (reservation: any) => {
          reservation["guest"] =
            (await db("guests")
              .where({
                active: true,
                id: reservation.guest_id,
              })
              .first()) || {};
          return reservation;
        })
      ),
    ]);

    return { reservations: promise[0], count: promise[1] };
  }

  async store(start: any, end: any, rooms_ids: any, guest_id: any) {
    let reservation = await db("reservations")
      .insert({
        start: start,
        end: end,
        guest_id: guest_id,
      })
      .returning("id");
    await db("rooms_reservations").insert(
      rooms_ids.map((room: any) => ({
        reservation_id: reservation[0].id,
        room_id: room,
      }))
    );
    return reservation;
  }

  async update(
    id: number,
    start: any,
    end: any,
    rooms_ids: any,
    guest_id: any
  ) {
    let reservation = await db("reservations")
      .where({ id })
      .update({
        start: start,
        end: end,
        guest_id: guest_id,
      })
      .returning("id");

    await db("rooms_reservations").where({ reservation_id: id }).del();

    await db("rooms_reservations").insert(
      rooms_ids.map((room: any) => ({
        reservation_id: reservation[0].id,
        room_id: room,
      }))
    );
    return reservation;
  }

  async delete(id: number) {
    return await db("reservations").where({ id }).update({ active: false });
  }

  async getGuestReservations(guest_id: number) {
    let reservations: any = await Promise.all([
      db("reservations")
        .where({ active: true, guest_id })
        .where("start", "<", new Date())
        .where("end", ">", new Date()),
      db("reservations")
        .where({ active: true, guest_id })
        .where("start", ">", new Date()),
    ]);

    reservations[0].forEach(
      (reservation: any) => (reservation["is_current"] = true)
    );

    reservations = [...reservations[0], ...reservations[1]];

    await Promise.all(
      reservations.map(async (reservation: any) => {
        reservation["rooms"] =
          (await db("rooms_reservations")
            .where("rooms_reservations.reservation_id", reservation.id)
            .where("rooms_reservations.active", true)
            .where("rooms.active", true)
            .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")) || [];
        return reservation;
      })
    );
    return reservations;
  }

  async getRoomReservations(room_id: number) {
    let reservations: any = await Promise.all([
      db("rooms_reservations")
        .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")
        .leftJoin(
          "reservations",
          "rooms_reservations.reservation_id",
          "reservations.id"
        )
        .where("reservations.active", true)
        .where("reservations.start", "<", new Date())
        .where("reservations.end", ">", new Date())
        .where("rooms.id", room_id)
        .select(
          "reservations.start",
          "reservations.end",
          "reservations.guest_id",
          "rooms.id"
        ),
      db("rooms_reservations")
        .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")
        .leftJoin(
          "reservations",
          "rooms_reservations.reservation_id",
          "reservations.id"
        )
        .where("reservations.active", true)
        .where("reservations.start", ">", new Date())
        .where("rooms.id", room_id)
        .select(
          "reservations.start",
          "reservations.end",
          "reservations.guest_id",
          "rooms.id"
        ),
    ]);

    reservations[0].forEach(
      (reservation: any) => (reservation["is_current"] = true)
    );

    reservations = [...reservations[0], ...reservations[1]];

    await Promise.all(
      reservations.map(async (reservation: any) => {
        reservation["guest"] =
          (await db("guests")
            .where({
              active: true,
              id: reservation.guest_id,
            })
            .first()) || {};
        return reservation;
      })
    );

    return reservations;
  }

  async getReservationsByDay(day: string) {
    let reservations: any = await db("reservations")
      .where({ active: true })
      .whereRaw("date(start) <= ?", [day])
      .whereRaw('date("end") >= ?', [day]);

    await Promise.all([
      Promise.all(
        reservations.map(async (reservation: any) => {
          reservation["rooms"] =
            (await db("rooms_reservations")
              .where("rooms_reservations.reservation_id", reservation.id)
              .where("rooms_reservations.active", true)
              .where("rooms.active", true)
              .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")) ||
            [];
          return reservation;
        })
      ),
      Promise.all(
        reservations.map(async (reservation: any) => {
          reservation["guest"] =
            (await db("guests")
              .where({
                active: true,
                id: reservation.guest_id,
              })
              .first()) || {};
          return reservation;
        })
      ),
    ]);
    return reservations;
  }

  async countReservationsMonthly(start: string, end: string) {
    return await db("reservations")
      .where({ active: true })
      .where(function () {
        this.whereBetween("start", [start, end]).orWhereBetween("end", [
          start,
          end,
        ]);
      });
  }
}
