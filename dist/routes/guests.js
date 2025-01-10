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
const guests_1 = require("../controllers/guests");
const reservations_1 = require("../controllers/reservations");
const express_validator_1 = require("express-validator");
const guests_2 = require("../data/guests");
const reservations_2 = require("../data/reservations");
const rooms_1 = require("../data/rooms");
const guestsData = new guests_2.GuestsData();
const reservationsData = new reservations_2.ReservationsData();
const roomsData = new rooms_1.RoomsData();
const guestsController = new guests_1.GuestsController(guestsData, reservationsData);
const reservationsController = new reservations_1.ReservationsController(reservationsData, guestsData, roomsData);
const Router = express_1.default.Router();
Router.route("")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = Number(req.query.page || 1);
        let response = yield guestsController.index(page);
        // let guests = await
        res.json({
            error: false,
            data: response.guests,
            pagination: response.pagination,
        });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .post([
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("phone_number").isNumeric(),
    (0, express_validator_1.body)("name").notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.array().length) {
            res.json({ error: true, errors: errors.array() });
        }
        else {
            let guest = yield guestsController.store(req.body);
            res.json({ error: false, data: guest });
        }
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.get("/select", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let guests = yield guestsController.select(`${req.query.name}` || "");
        res.json({ error: false, data: guests });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.route("/:id")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { guest, past_reservations } = yield guestsController.show(req.params.id);
        res.json({ error: false, data: { guest, past_reservations }, });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .put([
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("phone_number").isNumeric(),
    (0, express_validator_1.body)("name").notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.array().length) {
            res.json({ error: true, errors: errors.array() });
        }
        else {
            let guest = yield guestsController.update(req.params.id, req.body);
            res.json({ error: false, data: guest });
        }
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield guestsController.delete(req.params.id);
        res.json({ error: false });
    }
    catch (err) {
        res.json({ error: true, message: err.message });
    }
}));
Router.get("/:id/reservations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reservations = yield reservationsController.getGuestReservations(+req.params.id);
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
