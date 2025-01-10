import { db } from "../db/db";

export class HomeData {
  async index() {
    return await Promise.all([
      db('rooms').where({active:true}).count().first(),
      db('guests').where({active:true}).count().first(),
      db('reservations').where({active:true}).count().first()
  ])
  }
}
