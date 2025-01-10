import { db } from "../db/db";
import { Request, Response } from "express";
import { ReservationsData } from "../data/reservations";
import { GuestsData } from "../data/guests";
import { RoomsData } from "../data/rooms";

const limit = 30;

export class ReservationsController {
  constructor(
    private reservationsData: ReservationsData,
    private guestsData: GuestsData,
    private roomsData: RoomsData
  ) {}
  async index(page: number) {
    let offset = (page - 1) * limit;
    let { reservations, count } = await this.reservationsData.index(offset);
    return {
      reservations,
      pagination: {
        index: page - 1,
        length: Math.ceil(+(count?.count || 0) / limit),
      },
    };
  }

  async store(guest_id: any, rooms_ids: any, start: any, end: any) {
    let array = await Promise.all([
      this.guestsData.show(guest_id),
      ...rooms_ids.map(async (id: number) => {
        return await this.roomsData.show(id);
      }),
    ]);

    if (!array.every((one: any) => !!one)) {
      throw new Error("Invalid data");
    }

    let joined = await this.roomsData.checkBookedRooms(rooms_ids, start, end);

    if (joined.length)
      throw new Error(
        "These rooms are booked: " +
          joined.map((room: any) => room.number + ". " + room.name + "  ")
      );
    else {
      return await this.reservationsData.store(start, end, rooms_ids, guest_id);
    }
  }

  async update(
    reservation_id: number,
    guest_id: any,
    rooms_ids: any,
    start: any,
    end: any
  ) {
    let array = await Promise.all([
      this.guestsData.show(guest_id),
      ...rooms_ids.map(async (id: number) => {
        return await this.roomsData.show(id);
      }),
    ]);

    if (!array.every((one: any) => !!one)) {
      throw new Error("Invalid data");
    }

    let joined = await this.roomsData.checkBookedRooms(
      rooms_ids,
      start,
      end,
      reservation_id
    );

    if (joined.length)
      throw new Error(
        "These rooms are booked: " +
          joined.map((room: any) => room.number + ". " + room.name + "  ")
      );
    else {
      return await this.reservationsData.update(
        reservation_id,
        start,
        end,
        rooms_ids,
        guest_id
      );
    }
  }

  async delete(id: number) {
    return await this.reservationsData.delete(id);
  }

  async getGuestReservations(id: number) {
    return await this.reservationsData.getGuestReservations(id);
  }

  async getRoomReservations(id: number) {
    return await this.reservationsData.getRoomReservations(id);
  }

  async getReservationsByDay(day: string) {
    return await this.reservationsData.getReservationsByDay(day);
  }

  async countReservationsMonthly(start: string, end: string) {
    let reservations = await this.reservationsData.countReservationsMonthly(
      start,
      end
    );

    let days_array: any = this.numberToArray(new Date(end).getDate());
    let days = Object.assign(
      {},
      ...days_array.map((one: any) => ({ [one]: 0 }))
    );

    reservations.forEach((reservation) => {
      let starting = this.getDateOnly(reservation.start);
      let ending = this.getDateOnly(reservation.end);
      days_array.forEach((day: any) => {
        let day_date: any = new Date(start);
        day_date.setDate(day);
        day_date = this.getDateOnly(day_date);
        if (
          this.dates_difference(day_date, starting) >= 0 &&
          this.dates_difference(ending, day_date) >= 0
        )
          days[day]++;
      });
    });

    return days;
  }
  dates_difference(date1: any, date2: any) {
    return (
      (new Date(date1).getTime() - new Date(date2).getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }
  numberToArray(num: number) {
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push(i);
    }
    return arr;
  }

  getDateOnly(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return new Date(`${year}-${month}-${day}`);
  }
}
