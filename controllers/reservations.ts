import { validationResult } from "express-validator";
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
            return reservation;
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
      const errors = validationResult(req);
      if (errors.array().length)
        res.json({ error: true, errors: errors.array() });
      else {
        if (dates_difference(req.body.end, req.body.start) < 1) {
          throw new Error("Invalid date range, the minimum range is 1 day");
        }

        if (dates_difference(req.body.start, new Date()) < -1) {
          throw new Error(
            "Invalid reservation date, the reservation can't be in the past"
          );
        }

        let array = await Promise.all([
          db("guests").where({ active: true, id: req.body.guest_id }).first(),
          ...req.body.rooms_ids.map(async (id: number) => {
            return await db("rooms").where({ active: true, id }).first();
          }),
        ]);

        if (!array.every((one: any) => !!one)) {
          throw new Error("Invalid data");
        }

        if (!req.body.rooms_ids?.length) {
          throw new Error("you have to pick at least one room");
        }

        let joined = await db("rooms_reservations")
          .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")
          .leftJoin(
            "reservations",
            "rooms_reservations.reservation_id",
            "reservations.id"
          )
          .select(
            "reservations.start",
            "reservations.end",
            "rooms.id as room_id",
            "rooms.name",
            "rooms.number"
          )
          .whereIn("rooms.id", req.body.rooms_ids || [])
          .where("reservations.end", ">=", req.body.start)
          .where("reservations.start", "<=", req.body.end);

        if (joined.length) {
          res.json({
            error: true,
            message: "These rooms are booked",
            data: joined,
          });
        } else {
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
        }
      }
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

  getGuestReservations: async (req: Request, res: Response) => {
    try {
      let reservations: any = await Promise.all([
        db("reservations")
          .where({ active: true, guest_id: req.params.id })
          .where("start", "<", new Date())
          .where("end", ">", new Date()),
        db("reservations")
          .where({ active: true, guest_id: req.params.id })
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
              .leftJoin("rooms", "rooms_reservations.room_id", "rooms.id")) ||
            [];
          return reservation;
        })
      ),
        res.json({
          error: false,
          data: reservations,
        });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  getRoomReservations: async (req: Request, res: Response) => {
    try {
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
          .where("rooms.id", req.params.id)
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
          .where("rooms.id", req.params.id)
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
      ),
        res.json({
          error: false,
          data: reservations,
        });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  getReservationsByDay: async (req:Request, res:Response) => {

    try {
      let day = req.query.day;

      
      let reservations: any = await db("reservations").where({ active: true }).whereRaw('date(start) <= ?', [day]).whereRaw('date("end") >= ?', [day])
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

      res.json({
        error: false,
        data: reservations,
      });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
    
  },


  countReservationsMonthly: async (req: Request, res: Response) => {
    try {
      let start: any = req.query.start;
      let end: any = req.query.end;
      let reservations = await db("reservations")
        .where({ active: true })
        .where(function () {
          this.whereBetween("start", [start, end]).orWhereBetween("end", [
            start,
            end,
          ]);
        });

      let days_array: any = numberToArray(new Date(end).getDate());
      let days = Object.assign(
        {},
        ...days_array.map((one: any) => ({ [one]: 0 }))
      );

      reservations.forEach((reservation) => {
        let starting = getDateOnly(reservation.start);
        let ending = getDateOnly(reservation.end);
        days_array.forEach((day: any) => {
          let day_date: any = new Date(start);
          day_date.setDate(day);
          day_date = getDateOnly(day_date);
          if (
            dates_difference(day_date, starting) >= 0 &&
            dates_difference(ending, day_date) >= 0
          )
            days[day]++;
        });
      });

      res.json({ error: false, data: days });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },
};
const dates_difference = (date1: any, date2: any) => {
  return (
    (new Date(date1).getTime() - new Date(date2).getTime()) /
    (1000 * 60 * 60 * 24)
  );
};

const numberToArray = (num: number) => {
  const arr = [];
  for (let i = 1; i <= num; i++) {
    arr.push(i);
  }
  return arr;
};

const getDateOnly = (date: any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return new Date(`${year}-${month}-${day}`);
};
