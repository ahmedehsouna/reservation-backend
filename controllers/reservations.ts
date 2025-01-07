import { db } from "../db/db";
import { Request, Response } from "express";

const limit = 30;

export default {
  index: async (req: Request, res: Response) => {
    try {
      let page: number = Number(req.query.page || 1);
      let offset = (page - 1) * limit;
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
          })
        ),
      ]);

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

  store: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      let reservation: any = await db("reservations")
        .insert({
          start: req.body.start,
          end: req.body.end,
          guest_id: req.body.guest_id,
        })
        .returning("id");
      await db("rooms_reservations").insert(
        req.body.rooms_ids.map((room: any) => ({
          reservation_id: reservation[0].id,
          room_id: room,
        }))
      );
      res.json({ error: false });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      let reservation = await db("reservations")
        .where({ id: req.params["id"] })
        .update(req.body);
      res.json({ error: false, data: reservation });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      let reservation = await db("reservations")
        .where({ id: req.params["id"] })
        .update({ active: false });
      res.json({ error: false, data: reservation });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },
};
