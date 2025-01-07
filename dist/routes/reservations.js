"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservations_1 = __importDefault(require("../controllers/reservations"));
const Router = express_1.default.Router();
Router.route('')
    .get(reservations_1.default.index)
    .post(reservations_1.default.store);
Router.route('/:id')
    .put(reservations_1.default.update)
    .delete(reservations_1.default.delete);
exports.default = Router;
