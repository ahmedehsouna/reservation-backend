"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rooms_1 = __importDefault(require("../controllers/rooms"));
const Router = express_1.default.Router();
Router.route('')
    .get(rooms_1.default.index)
    .post(rooms_1.default.store);
Router.route('/:id')
    .put(rooms_1.default.update)
    .delete(rooms_1.default.delete);
exports.default = Router;
