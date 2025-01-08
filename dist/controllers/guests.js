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
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = require("../db/db");
const limit = 30;
exports.default = {
    index: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let page = Number(req.query.page || 1);
            let offset = (page - 1) * limit;
            let promise = yield Promise.all([
                (0, db_1.db)("guests").where({ active: true }).offset(offset).limit(limit),
                (0, db_1.db)("guests").where({ active: true }).count().first(),
            ]);
            // let guests = await
            res.json({
                error: false,
                data: promise[0],
                pagination: {
                    index: page - 1,
                    length: Math.ceil(+(((_a = promise[1]) === null || _a === void 0 ? void 0 : _a.count) || 0) / limit),
                },
            });
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    }),
    show: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let [guest, past_reservations] = yield Promise.all([
                (0, db_1.db)("guests").where({ id: req.params.id, active: true, }).first(),
                (0, db_1.db)("reservations").where({ active: true, guest_id: req.params.id }).where('end', '<=', new Date()).count().first()
            ]);
            // let guests = await
            res.json({
                error: false,
                data: { guest, past_reservations },
            });
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    }),
    store: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let guest = yield (0, db_1.db)("guests").insert(req.body);
            res.json({ error: false, data: guest });
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.array().length)
                res.json({ error: true, errors: errors.array() });
            else {
                let guest = yield (0, db_1.db)("guests")
                    .where({ id: req.params["id"] })
                    .update(req.body);
                res.json({ error: false, data: guest });
            }
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let guest = yield (0, db_1.db)("guests")
                .where({ id: req.params["id"] })
                .update({ active: false });
            res.json({ error: false, data: guest });
        }
        catch (err) {
            res.json({ error: true, message: err.message });
        }
    }),
};
