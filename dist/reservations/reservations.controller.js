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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_config_1 = require("../common/config/multer.config");
const reservations_service_1 = require("./reservations.service");
const reservation_dto_1 = require("./dto/reservation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const reservation_status_enum_1 = require("../common/enums/reservation-status.enum");
let ReservationsController = class ReservationsController {
    reservationsService;
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    create(createReservationDto, req) {
        return this.reservationsService.create(createReservationDto, req.user);
    }
    findMyReservations(req) {
        return this.reservationsService.findAll(req.user.role, req.user.id);
    }
    findAllAdmin() {
        return this.reservationsService.findAll('ADMIN');
    }
    findOne(id, req) {
        return this.reservationsService.findOne(id);
    }
    updateStatus(id, status, internalNotes) {
        return this.reservationsService.updateStatus(id, status, internalNotes);
    }
    async uploadProof(id, file, req) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        return this.reservationsService.uploadProof(id, req.user.id, file.path);
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CLIENT),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reservation_dto_1.CreateReservationDto, Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CLIENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findMyReservations", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.AGENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.AGENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('internalNotes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/upload-proof'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CLIENT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multer_config_1.multerConfig)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "uploadProof", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, common_1.Controller)('reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map