"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservations_1 = __importDefault(require("../controllers/reservations"));
const express_validator_1 = require("express-validator");
const Router = express_1.default.Router();
Router.route('')
    .get(reservations_1.default.index)
    .post((0, express_validator_1.body)('guest_id').notEmpty(), reservations_1.default.store);
Router.route('/:id')
    .put(reservations_1.default.update)
    .delete(reservations_1.default.delete);
Router.get('/monthly', reservations_1.default.countReservationsMonthly);
Router.get('/by-day', reservations_1.default.getReservationsByDay);
exports.default = Router;
