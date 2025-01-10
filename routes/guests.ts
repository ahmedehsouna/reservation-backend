import express, { Request, Response } from "express";
import { GuestsController } from "../controllers/guests";
import {ReservationsController} from "../controllers/reservations";
import { body, validationResult } from "express-validator";
import { GuestsData } from "../data/guests";
import { ReservationsData } from "../data/reservations";
import { RoomsData } from "../data/rooms";

const guestsData = new GuestsData();
const reservationsData = new ReservationsData();
const roomsData = new RoomsData();
const guestsController = new GuestsController(guestsData, reservationsData);
const reservationsController = new ReservationsController(reservationsData, guestsData, roomsData)

const Router = express.Router();

Router.route("")
  .get(async (req: Request, res: Response) => {
    try {
      let page: number = Number(req.query.page || 1);
      let response: any = await guestsController.index(page);

      // let guests = await
      res.json({
        error: false,
        data: response.guests,
        pagination: response.pagination,
      });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  })
  .post(
    [
      body("email").isEmail(),
      body("phone_number").isNumeric(),
      body("name").notEmpty(),
    ],
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (errors.array().length) {
          res.json({ error: true, errors: errors.array() });
        } else {
          let guest = await guestsController.store(req.body);
          res.json({ error: false, data: guest });
        }
      } catch (err: any) {
        res.json({ error: true, message: err.message });
      }
    }
  );


Router.get("/select", async (req: Request, res: Response) => {

  try{
    let guests = await guestsController.select(`${req.query.name}` || "")
    res.json({error: false, data: guests});

  }catch (err: any) {
    res.json({ error: true, message: err.message });
  }

})

Router.route("/:id")
  .get(async (req: Request, res: Response) => {
    try{
         let {guest , past_reservations} = await guestsController.show(req.params.id)
         res.json({error:false, data: {guest, past_reservations}, });
    }catch (err: any) {
        res.json({ error: true, message: err.message });
      }
  })
  .put(
    [
      body("email").isEmail(),
      body("phone_number").isNumeric(),
      body("name").notEmpty(),
    ],
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (errors.array().length) {
          res.json({ error: true, errors: errors.array() });
        } else {
          let guest = await guestsController.update(req.params.id, req.body);
          res.json({ error: false, data: guest });
        }
      } catch (err: any) {
        res.json({ error: true, message: err.message });
      }
    }
  )
  .delete(async (req: Request, res: Response) => {
    try {
      await guestsController.delete(req.params.id);
      res.json({ error: false });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  });

Router.get("/:id/reservations", async (req: Request, res: Response) => {
  try{

    let reservations = await reservationsController.getGuestReservations(+req.params.id)

    res.json({
      error: false,
      data: reservations,
    });
} catch (err: any) {
  res.json({ error: true, message: err.message });
}
  
});

export default Router;
