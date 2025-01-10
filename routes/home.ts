import express, { Request, Response } from "express";
import { HomeController } from "../controllers/home";
import { HomeData } from "../data/home";

const Router = express.Router();

const homeData = new HomeData();
const homeController = new HomeController(homeData);

Router.route("").get(async (req: Request, res: Response) => {
  try {
    let [rooms, guests, reservations] = await homeController.index();
    res.json({ error: false, data: { rooms: rooms, guests, reservations } });
  } catch (err: any) {
    res.json({ error: true, message: err.message });
  }
});

export default Router;
