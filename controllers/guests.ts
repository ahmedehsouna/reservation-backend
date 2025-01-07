import { validationResult } from "express-validator";
import { db } from "../db/db";
import { Request, Response } from "express";

const limit = 30;

export default {
  index: async (req: Request, res: Response) => {
    try {
      let page: number = Number(req.query.page || 1);
      let offset = (page - 1) * limit;
      let promise = await Promise.all([
        db("guests").where({ active: true }).offset(offset).limit(limit),
        db("guests").where({ active: true }).count().first(),
      ]);
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

  store: async (req: Request, res: Response) => {
    try {
      let guest = await db("guests").insert(req.body);
      res.json({ error: false, data: guest });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      console.log()
      if (errors.array().length) res.json({ error: true, errors: errors.array() });
      else {
        let guest = await db("guests")
          .where({ id: req.params["id"] })
          .update(req.body);
        res.json({ error: false, data: guest });
      }
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      let guest = await db("guests")
        .where({ id: req.params["id"] })
        .update({ active: false });
      res.json({ error: false, data: guest });
    } catch (err: any) {
      res.json({ error: true, message: err.message });
    }
  },
};
