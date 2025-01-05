"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const guests_1 = __importDefault(require("./routes/guests"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const reservations_1 = __importDefault(require("./routes/reservations"));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.get('', (req, res) => { res.json({ success: true }); });
app.use('/api/guests', guests_1.default);
app.use('/api/rooms', rooms_1.default);
app.use('/api/reservations', reservations_1.default);
app.listen(3000);
