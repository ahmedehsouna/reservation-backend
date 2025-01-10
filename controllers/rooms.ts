import { RoomsData } from "../data/rooms";

const limit = 30;

export class RoomsController {
  constructor(private roomsData: RoomsData) {}

  async index(page: number, sort_by: string, direction: string) {
    let offset = (page - 1) * limit;

    let promise = await this.roomsData.index({
      limit,
      offset,
      direction,
      sort_by,
    });
    return {
      rooms: promise[0],
      pagination: {
        index: page - 1,
        length: Math.ceil(+(promise[1]?.count || 0) / limit),
      },
    };
  }

  async select(name:string) {
    return await this.roomsData.select(name, limit);
 }

  async show(id:string) {
      return await this.roomsData.show(+id);   
  }

  async store(body: any) {
    let [name, number] = await Promise.all([
      this.roomsData.checkRoomUnique("name", body.name),
      this.roomsData.checkRoomUnique("number", body.number),
    ]);

    let message =
      (name || number ? "These fields exist: " : "") +
      (name ? "Name " : "") +
      (number ? "Number " : "");
    if (message) throw new Error(message);
    return await this.roomsData.store(body);
  }

  async update(id: string, body: any) {
    let [name, number] = await Promise.all([
      this.roomsData.checkRoomUnique("name", body.name, +id),
      this.roomsData.checkRoomUnique("number", body.number, +id),
    ]);

    let message =
      (name || number ? "These fields exist: " : "") +
      (name ? "Name " : "") +
      (number ? "Number " : "");

    if (message) throw new Error(message);

    return await this.roomsData.update(id, body);
  }

  async delete(id:string) {
      return await this.roomsData.delete(id)    
  }
}
