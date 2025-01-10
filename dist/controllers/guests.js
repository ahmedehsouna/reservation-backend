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
exports.GuestsController = void 0;
const limit = 30;
class GuestsController {
    constructor(guestsData, reservationsData) {
        this.guestsData = guestsData;
        this.reservationsData = reservationsData;
    }
    index(page) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let offset = (page - 1) * limit;
            let response = yield this.guestsData.index(offset, limit);
            return {
                guests: response[0],
                pagination: {
                    index: page - 1,
                    length: Math.ceil(+(((_a = response[1]) === null || _a === void 0 ? void 0 : _a.count) || 0) / limit),
                },
            };
            // let guests = await
        });
    }
    select(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.guestsData.select(name, limit);
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let [guest, past_reservations] = yield Promise.all([
                this.guestsData.show(id),
                this.reservationsData.get_guest_past_reservations(id),
            ]);
            return { guest, past_reservations };
        });
    }
    store(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let [name, email, phone_number] = yield Promise.all([
                this.guestsData.checkGuestUnique("name", body.name),
                this.guestsData.checkGuestUnique("email", body.email),
                this.guestsData.checkGuestUnique("phone_number", body.phone_number),
            ]);
            let message = (name || email || phone_number ? "These fields exist: " : "") +
                (name ? "Name " : "") +
                (email ? "Email " : "") +
                (phone_number ? "Phone number" : "");
            if (message)
                throw new Error(message);
            return yield this.guestsData.store(body);
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let [name, email, phone_number] = yield Promise.all([
                this.guestsData.checkGuestUnique("name", body.name, +id),
                this.guestsData.checkGuestUnique("email", body.email, +id),
                this.guestsData.checkGuestUnique("phone_number", body.phone_number, +id),
            ]);
            let message = (name || email || phone_number ? "These fields exist: " : "") +
                (name ? "Name " : "") +
                (email ? "Email " : "") +
                (phone_number ? "Phone number" : "");
            if (message)
                throw new Error(message);
            return yield this.guestsData.update(id, body);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.guestsData.delete(id);
        });
    }
}
exports.GuestsController = GuestsController;
