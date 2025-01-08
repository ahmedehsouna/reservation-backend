"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guests_1 = __importDefault(require("../controllers/guests"));
const reservations_1 = __importDefault(require("../controllers/reservations"));
const express_validator_1 = require("express-validator");
const Router = express_1.default.Router();
Router.route('')
    .get(guests_1.default.index)
    .post(guests_1.default.store);
Router.route('/:id')
    .get(guests_1.default.show)
    .put([(0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('phone_number').isNumeric(), (0, express_validator_1.body)('name').notEmpty()], guests_1.default.update)
    .delete(guests_1.default.delete);
Router.get('/:id/reservations', reservations_1.default.getGuestReservations);
exports.default = Router;
