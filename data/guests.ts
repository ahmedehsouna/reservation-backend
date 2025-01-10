import { db } from "../db/db";

export class GuestsData {
  async index(offset: number, limit: number) {
    return await Promise.all([
      db("guests").where({ active: true }).offset(offset).limit(limit),
      db("guests").where({ active: true }).count().first(),
    ]);
  }

  async select(name: string, limit: number) {
    return await db("guests").where({ active: true }).where('name', 'ilike', `%${name}%`) .limit(limit)
  }

  async show(id:string) {
      return await  db("guests").where({ id, active: true }).first();
  }

  async store(body: any) {
    return await db("guests").insert(body).returning("*");
  }

  async update(id: string, body: any) {
    return await db("guests").where({ id }).update(body);
  }

  async delete(id:string) {
    return await db("guests")
        .where({ id})
        .update({ active: false });
   
  }

  async checkGuestUnique(key:string, name:string, id:number = -1){
    return await db("guests").where({active:true, [key]:name}).whereNot({id}).first()
  }

}
