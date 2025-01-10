import express, { Request, Response } from "express";
import { ReservationsController } from "../controllers/reservations";
import { body, validationResult } from "express-validator";
import { ReservationsData } from "../data/reservations";
import { RoomsData } from "../data/rooms";
import { GuestsData } from "../data/guests";

const Router = express.Router();

const reservationsData = new ReservationsData();
const roomsData = new RoomsData();
const guestsData = new GuestsData();
const reservationsController = new ReservationsController(
  reservationsData,
  guestsData,
  roomsData
);

Router.route("")
  .get(async (req: Request, res: Response) => {
    try {
      let page: number = Number(req.query.page || 1);

      let { reservations, pagination } = await reservationsController.index(
        page
      );

      res.json({
        error: false,
        data: reservations,
        pagination: pagination,
      });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  })
  .post(
    [
      body("guest_id").notEmpty(),
      body("start").notEmpty(),
      body("end").notEmpty(),
      body("rooms_ids").isArray({ min: 1 }),
    ],
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (errors.array().length)
          res.json({ error: true, errors: errors.array() });
        else {
          if (isNaN(new Date(req.body.start).getDate()))
            throw new Error("Invalid starting date");
          if (isNaN(new Date(req.body.end).getDate()))
            throw new Error("Invalid ending date");

          if (
            reservationsController.dates_difference(
              req.body.end,
              req.body.start
            ) < 1
          ) {
            throw new Error("Invalid date range, the minimum range is 1 day");
          }

          if (
            reservationsController.dates_difference(
              req.body.start,
              new Date()
            ) < -1
          ) {
            throw new Error(
              "Invalid reservation date, the reservation can't be in the past"
            );
          }

          // if (!req.body.rooms_ids?.length) {
          //     throw new Error("you have to pick at least one room");
          //   }

          await reservationsController.store(
            req.body.guest_id,
            req.body.rooms_ids,
            req.body.start,
            req.body.end
          );
          res.json({ error: false });
        }
      } catch (err: any) {
        res.json({ error: true, message: err.message });
      }
    }
  );

Router.route("/:id")
  .put(
    [
      body("guest_id").notEmpty(),
      body("start").notEmpty(),
      body("end").notEmpty(),
      body("rooms_ids").isArray({ min: 1 }),
    ],
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (errors.array().length)
          res.json({ error: true, errors: errors.array() });
        else {
          if (isNaN(new Date(req.body.start).getDate()))
            throw new Error("Invalid starting date");
          if (isNaN(new Date(req.body.end).getDate()))
            throw new Error("Invalid ending date");

          if (
            reservationsController.dates_difference(
              req.body.end,
              req.body.start
            ) < 1
          ) {
            throw new Error("Invalid date range, the minimum range is 1 day");
          }

          if (
            reservationsController.dates_difference(
              req.body.start,
              new Date()
            ) < -1
          ) {
            throw new Error(
              "Invalid reservation date, the reservation can't be in the past"
            );
          }
          await reservationsController.update(
            +req.params.id,
            req.body.guest_id,
            req.body.rooms_ids,
            req.body.start,
            req.body.end
          );
          res.json({ error: false });
        }
      } catch (err: any) {
        res.json({ error: true, message: err.message });
      }
    }
  )
  .delete(async (req, res) => {
    try {
      let reservation = await reservationsController.delete(+req.params.id);
      res.json({ error: false, data: reservation });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  });

Router.get("/monthly", async (req: Request, res: Response) => {
  try {
    let start: string = req.query.start as string;
    let end: string = req.query.end as string;

    let days = await reservationsController.countReservationsMonthly(
      start,
      end
    );

    res.json({ error: false, data: days });
  } catch (err: any) {
    res.json({ error: true, message: err.message });
  }
});
Router.get("/by-day", async (req: Request, res: Response) => {
  try {
    let day: string = req.query.day as string;

    let reservations = await reservationsController.getReservationsByDay(day);

    res.json({
      error: false,
      data: reservations,
    });
  } catch (err: any) {
    res.json({ error: true, message: err.message });
  }
});

export default Router;
