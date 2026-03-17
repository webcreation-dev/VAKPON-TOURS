"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const pack_entity_1 = require("../../packs/entities/pack.entity");
const pack_option_entity_1 = require("../../packs/entities/pack-option.entity");
const reservation_status_enum_1 = require("../../common/enums/reservation-status.enum");
let Reservation = class Reservation {
    id;
    reference;
    startDate;
    participantsCount;
    status;
    basePriceAtBooking;
    totalPrice;
    paymentProofUrl;
    internalNotes;
    user;
    pack;
    selectedOptions;
    createdAt;
    updatedAt;
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Reservation.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Reservation.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Reservation.prototype, "participantsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: reservation_status_enum_1.ReservationStatus,
        default: reservation_status_enum_1.ReservationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Reservation.prototype, "basePriceAtBooking", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Reservation.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "paymentProofUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "internalNotes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reservations),
    __metadata("design:type", user_entity_1.User)
], Reservation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pack_entity_1.Pack, (pack) => pack.reservations),
    __metadata("design:type", pack_entity_1.Pack)
], Reservation.prototype, "pack", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => pack_option_entity_1.PackOption),
    (0, typeorm_1.JoinTable)({ name: 'reservation_selected_options' }),
    __metadata("design:type", Array)
], Reservation.prototype, "selectedOptions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)('reservations')
], Reservation);
//# sourceMappingURL=reservation.entity.js.map