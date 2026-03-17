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
exports.Pack = void 0;
const typeorm_1 = require("typeorm");
const pack_option_entity_1 = require("./pack-option.entity");
const reservation_entity_1 = require("../../reservations/entities/reservation.entity");
let Pack = class Pack {
    id;
    title;
    description;
    startingPrice;
    durationDays;
    includedServices;
    isPublished;
    options;
    reservations;
    createdAt;
    updatedAt;
};
exports.Pack = Pack;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pack.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pack.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Pack.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pack.prototype, "startingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pack.prototype, "durationDays", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Pack.prototype, "includedServices", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Pack.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pack_option_entity_1.PackOption, (option) => option.pack, { cascade: true }),
    __metadata("design:type", Array)
], Pack.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.pack),
    __metadata("design:type", Array)
], Pack.prototype, "reservations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pack.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pack.prototype, "updatedAt", void 0);
exports.Pack = Pack = __decorate([
    (0, typeorm_1.Entity)('packs')
], Pack);
//# sourceMappingURL=pack.entity.js.map