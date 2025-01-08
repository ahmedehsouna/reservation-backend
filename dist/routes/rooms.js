"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rooms_1 = __importDefault(require("../controllers/rooms"));
const reservations_1 = __importDefault(require("../controllers/reservations"));
const Router = express_1.default.Router();
Router.route('')
    .get(rooms_1.default.index)
    .post(rooms_1.default.store);
Router.route('/:id')
    .get(rooms_1.default.show)
    .put(rooms_1.default.update)
    .delete(rooms_1.default.delete);
Router.get('/:id/reservations', reservations_1.default.getRoomReservations);
exports.default = Router;
