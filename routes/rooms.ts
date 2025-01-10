import express, { Request, Response } from "express";
import { RoomsController } from "../controllers/rooms";
import { ReservationsController } from "../controllers/reservations";
import { RoomsData } from "../data/rooms";
import { body, validationResult } from "express-validator";
import { ReservationsData } from "../data/reservations";
import { GuestsData } from "../data/guests";

const roomsData = new RoomsData();
const reservationsData = new ReservationsData();
const guestsData = new GuestsData();
const roomsController = new RoomsController(roomsData);
const reservationsController = new ReservationsController(
  reservationsData,
  guestsData,
  roomsData
);

const Router = express.Router();

Router.route("")
  .get(async (req: Request, res: Response) => {
    try {
      let page: number = Number(req.query.page || 1);
      let sort_by: any = req.query.sort_by;
      let direction = req.query.order === "asc" ? "asc" : "desc";

      if (!["number", "name", "upcoming_reservations_count"].includes(sort_by))
        sort_by = "number";
      let { rooms, pagination } = await roomsController.index(
        page,
        sort_by,
        direction
      );

      res.json({
        error: false,
        data: rooms,
        pagination: pagination,
      });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  })
  .post(
    [body("name").notEmpty(), body("number").notEmpty()],
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (errors.array().length) {
          res.json({ error: true, errors: errors.array() });
        } else {
          let room = await roomsController.store(req.body);
          res.json({ error: false, data: room });
        }
      } catch (err: any) {
        res.json({ error: true, message: err.message });
      }
    }
  );

  Router.get("/select", async (req: Request, res: Response) => {

    try{
      let rooms = await roomsController.select(`${req.query.name}` || "")
      res.json({error: false, data: rooms});
  
    }catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  
  })

Router.route("/:id")
  .get(async (req: Request, res: Response) => {
    try {
      let room = await roomsController.show(req.params.id);
      res.json({
        error: false,
        data: room,
      });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  })
  .put(
    [body("name").notEmpty(), body("number").notEmpty()],
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (errors.array().length) {
          res.json({ error: true, errors: errors.array() });
        } else {
          let room = await roomsController.update(req.params.id, req.body);
          res.json({ error: false, data: room });
        }
      } catch (err: any) {
        res.json({ error: true, message: err.message });
      }
    }
  )

  .delete(async (req: Request, res: Response) => {
    try {
      await roomsController.delete(req.params.id);
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  });

Router.get("/:id/reservations", async (req: Request, res: Response) => {
  try {
    let reservations = await reservationsController.getRoomReservations(
      +req.params.id
    );

    res.json({
      error: false,
      data: reservations,
    });
  } catch (err: any) {
    res.json({ error: true, message: err.message });
  }
});

export default Router;
