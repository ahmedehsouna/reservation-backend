"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("./knexfile"));
// @ts-ignore
exports.db = (0, knex_1.default)(knexfile_1.default.development);
// export const Guest = () => db("guests");
// export const Reservation = () => db("reservations");
// export const Room = () => db("rooms");
