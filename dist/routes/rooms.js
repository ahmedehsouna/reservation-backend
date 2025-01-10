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
const rooms_1 = require("../controllers/rooms");
const reservations_1 = require("../controllers/reservations");
const rooms_2 = require("../data/rooms");
const express_validator_1 = require("express-validator");
const reservations_2 = require("../data/reservations");
const guests_1 = require("../data/guests");
const roomsData = new rooms_2.RoomsData();
const reservationsData = new reservations_2.ReservationsData();
const guestsData = new guests_1.GuestsData();
const roomsController = new rooms_1.RoomsController(roomsData);
const reservationsController = new reservations_1.ReservationsController(reservationsData, guestsData, roomsData);
const Router = express_1.default.Router();
Router.route("")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = Number(req.query.page || 1);
        let sort_by = req.query.sort_by;
        let direction = req.query.order === "asc" ? "asc" : "desc";
        if (!["number", "name", "upcoming_reservations_count"].includes(sort_by))
            sort_by = "number";
        let { rooms, pagination } = yield roomsController.index(page, sort_by, direction);
        res.json({
            error: false,
            data: rooms,
            pagination: pagination,
        });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .post([(0, express_validator_1.body)("name").notEmpty(), (0, express_validator_1.body)("number").notEmpty()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.array().length) {
            res.json({ error: true, errors: errors.array() });
        }
        else {
            let room = yield roomsController.store(req.body);
            res.json({ error: false, data: room });
        }
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.get("/select", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let rooms = yield roomsController.select(`${req.query.name}` || "");
        res.json({ error: false, data: rooms });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.route("/:id")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let room = yield roomsController.show(req.params.id);
        res.json({
            error: false,
            data: room,
        });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .put([(0, express_validator_1.body)("name").notEmpty(), (0, express_validator_1.body)("number").notEmpty()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.array().length) {
            res.json({ error: true, errors: errors.array() });
        }
        else {
            let room = yield roomsController.update(req.params.id, req.body);
            res.json({ error: false, data: room });
        }
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield roomsController.delete(req.params.id);
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.get("/:id/reservations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reservations = yield reservationsController.getRoomReservations(+req.params.id);
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
