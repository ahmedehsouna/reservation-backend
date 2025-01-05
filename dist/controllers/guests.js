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
const db_1 = __importDefault(require("../db/db"));
exports.default = {
    index: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let guests = yield (0, db_1.default)('guests').select('*');
            res.json({ error: false, data: guests });
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    }),
    store: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let guest = yield (0, db_1.default)('guests').insert({ name: 'Guest', email: 'guest@', phone_number: '0912893829' });
            res.json({ error: false, data: guest });
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let guest = yield (0, db_1.default)('guests').where(req.params['id']).update({ name: 'Guest', email: 'guest@', phone_number: '0912893829' }).returning('*');
            res.json({ error: false, data: guest });
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    })
};
