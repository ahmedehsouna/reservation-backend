import { db } from "../db/db";
import { Request, Response } from "express";

const limit = 30;

export default {
  index: async (req: Request, res: Response) => {
    try {
      let page: number = Number(req.query.page || 1);
      let offset = (page - 1) * limit;

      let sort_by:any = req.query.sort_by;
      if(!['number', 'name', 'upcoming_reservations_count'].includes(sort_by)) sort_by = 'number'
      let direction = req.query.order === 'asc'? 'asc':'desc';
      let promise = await Promise.all([
        // db('rooms').where({active: true}).offset(offset).limit(limit),

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
            db.raw("COUNT(reservations.id) FILTER (WHERE reservations.start > ?) as upcoming_reservations_count", [new Date()])
          )
        //   .where("reservations.start", ">", new Date()) // Assuming 'start' is a date column
        //   .orWhereNotNull("reservations.start") // Include rooms with no reservations
          .groupBy("rooms.id")
          .orderBy(sort_by, direction).offset(offset).limit(limit),
        //   .orderByRaw('upcoming_reservations_count', 'desc'),

        db("rooms").where({ active: true }).count().first(),
      ]);

      // await Promise.all(promise[0].map(async room => {
      //     room['upcoming_reservations_count'] = await db("rooms_reservations")
      //     .where("rooms_reservations.room_id", room.id)
      //     .where("rooms_reservations.active", true)
      //     .where('reservations.start', '>', new Date())
      //     // .orderBy()
      //     .leftJoin("reservations", "rooms_reservations.reservation_id", "reservations.id").count().first()

      //     room['upcoming_reservations_count'] = room['upcoming_reservations_count'].count
      //   return room;
      // })

      // )
      // let guests = await
      res.json({
        error: false,
        data: promise[0],
        pagination: {
          index: page - 1,
          length: Math.ceil(+(promise[1]?.count || 0) / limit),
        },
      });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  show: async (req: Request, res: Response) => {
    try {
      let room = await db("rooms")
        .where({ id: req.params.id, active: true })
        .first();

      // let guests = await
      res.json({
        error: false,
        data: room,
      });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  store: async (req: Request, res: Response) => {
    try {
      let guest = await db("rooms").insert(req.body);
      res.json({ error: false, data: guest });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      let guest = await db("rooms")
        .where({ id: req.params["id"] })
        .update(req.body);
      res.json({ error: false, data: guest });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      let guest = await db("rooms")
        .where({ id: req.params["id"] })
        .update({ active: false });
      res.json({ error: false, data: guest });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },
};
