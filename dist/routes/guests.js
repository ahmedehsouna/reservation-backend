"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guests_1 = __importDefault(require("../controllers/guests"));
const Router = express_1.default.Router();
Router.route('')
    .get(guests_1.default.index)
    .post(guests_1.default.store);
Router.route('/:id')
    .put(guests_1.default.update);
exports.default = Router;
