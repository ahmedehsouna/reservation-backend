"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservations_1 = require("../controllers/reservations");
const express_validator_1 = require("express-validator");
const reservations_2 = require("../data/reservations");
const rooms_1 = require("../data/rooms");
const guests_1 = require("../data/guests");
const Router = express_1.default.Router();
const reservationsData = new reservations_2.ReservationsData();
const roomsData = new rooms_1.RoomsData();
const guestsData = new guests_1.GuestsData();
const reservationsController = new reservations_1.ReservationsController(reservationsData, guestsData, roomsData);
Router.route("")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = Number(req.query.page || 1);
        let { reservations, pagination } = yield reservationsController.index(page);
        res.json({
            error: false,
            data: reservations,
            pagination: pagination,
        });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .post([
    (0, express_validator_1.body)("guest_id").notEmpty(),
    (0, express_validator_1.body)("start").notEmpty(),
    (0, express_validator_1.body)("end").notEmpty(),
    (0, express_validator_1.body)("rooms_ids").isArray({ min: 1 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.array().length)
            res.json({ error: true, errors: errors.array() });
        else {
            if (isNaN(new Date(req.body.start).getDate()))
                throw new Error("Invalid starting date");
            if (isNaN(new Date(req.body.end).getDate()))
                throw new Error("Invalid ending date");
            if (reservationsController.dates_difference(req.body.end, req.body.start) < 1) {
                throw new Error("Invalid date range, the minimum range is 1 day");
            }
            if (reservationsController.dates_difference(req.body.start, new Date()) < -1) {
                throw new Error("Invalid reservation date, the reservation can't be in the past");
            }
            // if (!req.body.rooms_ids?.length) {
            //     throw new Error("you have to pick at least one room");
            //   }
            yield reservationsController.store(req.body.guest_id, req.body.rooms_ids, req.body.start, req.body.end);
            res.json({ error: false });
        }
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.route("/:id")
    .put([
    (0, express_validator_1.body)("guest_id").notEmpty(),
    (0, express_validator_1.body)("start").notEmpty(),
    (0, express_validator_1.body)("end").notEmpty(),
    (0, express_validator_1.body)("rooms_ids").isArray({ min: 1 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.array().length)
            res.json({ error: true, errors: errors.array() });
        else {
            if (isNaN(new Date(req.body.start).getDate()))
                throw new Error("Invalid starting date");
            if (isNaN(new Date(req.body.end).getDate()))
                throw new Error("Invalid ending date");
            if (reservationsController.dates_difference(req.body.end, req.body.start) < 1) {
                throw new Error("Invalid date range, the minimum range is 1 day");
            }
            if (reservationsController.dates_difference(req.body.start, new Date()) < -1) {
                throw new Error("Invalid reservation date, the reservation can't be in the past");
            }
            yield reservationsController.update(+req.params.id, req.body.guest_id, req.body.rooms_ids, req.body.start, req.body.end);
            res.json({ error: false });
        }
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reservation = yield reservationsController.delete(+req.params.id);
        res.json({ error: false, data: reservation });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.get("/monthly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let start = req.query.start;
        let end = req.query.end;
        let days = yield reservationsController.countReservationsMonthly(start, end);
        res.json({ error: false, data: days });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.get("/by-day", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let day = req.query.day;
        let reservations = yield reservationsController.getReservationsByDay(day);
        res.json({
            error: false,
            data: reservations,
        });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
exports.default = Router;
