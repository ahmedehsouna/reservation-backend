import { GuestsData } from "../data/guests";
import { ReservationsData } from "../data/reservations";

const limit = 30;

export class GuestsController {
  constructor(
    private guestsData: GuestsData,
    private reservationsData: ReservationsData
  ) {}
  async index(page: number) {
    let offset = (page - 1) * limit;
    let response = await this.guestsData.index(offset, limit);
    return {
      guests: response[0],
      pagination: {
        index: page - 1,
        length: Math.ceil(+(response[1]?.count || 0) / limit),
      },
    };
    // let guests = await
  }

  async select(name:string) {
     return await this.guestsData.select(name, limit);
  }

  async show(id:string) {
    let [guest, past_reservations] = await Promise.all([
      this.guestsData.show(id),
      this.reservationsData.get_guest_past_reservations(id),
    ]);

    return { guest, past_reservations };
  }

  async store(body: any) {
    let [name, email, phone_number] = await Promise.all([
      this.guestsData.checkGuestUnique("name", body.name),
      this.guestsData.checkGuestUnique("email", body.email),
      this.guestsData.checkGuestUnique("phone_number", body.phone_number),
    ]);

    let message =
      (name || email || phone_number ? "These fields exist: " : "") +
      (name ? "Name " : "") +
      (email ? "Email " : "") +
      (phone_number ? "Phone number" : "");

    if (message) throw new Error(message);
    return await this.guestsData.store(body);
  }

  async update(id: string, body: any) {
    let [name, email, phone_number] = await Promise.all([
      this.guestsData.checkGuestUnique("name", body.name, +id),
      this.guestsData.checkGuestUnique("email", body.email, +id),
      this.guestsData.checkGuestUnique("phone_number", body.phone_number, +id),
    ]);

    let message =
      (name || email || phone_number ? "These fields exist: " : "") +
      (name ? "Name " : "") +
      (email ? "Email " : "") +
      (phone_number ? "Phone number" : "");

    if (message) throw new Error(message);

    return await this.guestsData.update(id, body);
  }

  async delete(id: string) {
    return await this.guestsData.delete(id);
  }
}
