import { db } from "../db/db";

export class RoomsData {
  async index({offset, limit, sort_by, direction}:any) {
    return await Promise.all([
      db("rooms")
          .leftJoin(
            "rooms_reservations",
            "rooms.id",
            "rooms_reservations.room_id"
          )
          .leftJoin(
            "reservations",
            "rooms_reservations.reservation_id",
            "reservations.id"
          )
          .select(
            "rooms.*",
            db.raw(
              "COUNT(reservations.id) FILTER (WHERE reservations.start > ? AND reservations.active = true) as upcoming_reservations_count",
              [new Date()]
            )
          )
          //   .where("reservations.start", ">", new Date()) // Assuming 'start' is a date column
          //   .orWhereNotNull("reservations.start") // Include rooms with no reservations
          .groupBy("rooms.id")
          .orderBy(sort_by, direction)
          .offset(offset)
          .limit(limit),
        //   .orderByRaw('upcoming_reservations_count', 'desc'),

        db("rooms").where({ active: true }).count().first(),
    ]);
  }

  async select(name: string, limit: number) {
    return await db("rooms").where({ active: true }).where(function(){
      this.where('name', 'ilike', `%${name}%`)
      .orWhere('number', 'ilike', `%${name}%`)
    })
      .limit(limit)
  }

  async show(id:number) {
      return await  db("rooms").where({ id, active: true }).first();
  }

  async store(body: any) {
    return await db("rooms").insert(body).returning("*");
  }

  async update(id: string, body: any) {
    return await db("rooms").where({ id }).update(body);
  }

  async delete(id:string) {
    return await db("rooms")
        .where({ id})
        .update({ active: false });
   
  }

  async checkBookedRooms(rooms_ids:any, start:any, end:any, reservation_id:number = -1){
    return await db("rooms_reservations")
          .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")
          .leftJoin(
            "reservations",
            "rooms_reservations.reservation_id",
            "reservations.id"
          )
          .select(
            "reservations.start",
            "reservations.end",
            "reservations.active",
            "reservations.id",
            "rooms.id as room_id",
            "rooms.name",
            "rooms.number"
          )
          .whereIn("rooms.id", rooms_ids || [])
          .where("reservations.end", ">=", start)
          .where("reservations.start", "<=", end)
          .where('reservations.active', true)
          .whereNot('reservations.id', reservation_id)
  } 

  async checkRoomUnique(key:string, name:string, id:number = -1){
    return await db("rooms").where({active:true, [key]:name}).whereNot({id}).first()
  }

}
