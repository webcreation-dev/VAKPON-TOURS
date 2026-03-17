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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const pack_entity_1 = require("../packs/entities/pack.entity");
const pack_option_entity_1 = require("../packs/entities/pack-option.entity");
const reservation_status_enum_1 = require("../common/enums/reservation-status.enum");
const mail_service_1 = require("../mail/mail.service");
let ReservationsService = class ReservationsService {
    reservationsRepository;
    packsRepository;
    optionsRepository;
    dataSource;
    mailService;
    constructor(reservationsRepository, packsRepository, optionsRepository, dataSource, mailService) {
        this.reservationsRepository = reservationsRepository;
        this.packsRepository = packsRepository;
        this.optionsRepository = optionsRepository;
        this.dataSource = dataSource;
        this.mailService = mailService;
    }
    async create(createReservationDto, user) {
        const { packId, optionIds, startDate, participantsCount } = createReservationDto;
        const pack = await this.packsRepository.findOne({
            where: { id: packId },
            relations: ['options'],
        });
        if (!pack) {
            throw new common_1.NotFoundException(`Pack with ID ${packId} not found`);
        }
        let selectedOptions = [];
        let optionsTotal = 0;
        if (optionIds && optionIds.length > 0) {
            selectedOptions = await this.optionsRepository.createQueryBuilder('option')
                .where('option.id IN (:...ids)', { ids: optionIds })
                .andWhere('option.packId = :packId', { packId })
                .getMany();
            if (selectedOptions.length !== optionIds.length) {
                throw new common_1.BadRequestException('Some selected options are invalid or do not belong to this pack');
            }
            optionsTotal = selectedOptions.reduce((sum, opt) => sum + Number(opt.price), 0);
        }
        const basePrice = Number(pack.startingPrice);
        const totalPrice = basePrice + optionsTotal;
        const reference = `VT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const reservation = this.reservationsRepository.create({
            reference,
            startDate: new Date(startDate),
            participantsCount,
            status: reservation_status_enum_1.ReservationStatus.PENDING,
            basePriceAtBooking: basePrice,
            totalPrice: totalPrice,
            user,
            pack,
            selectedOptions,
        });
        const savedReservation = await this.reservationsRepository.save(reservation);
        try {
            await this.mailService.sendAdminReservationNotification(savedReservation);
        }
        catch (error) {
            console.error('Failed to send admin notification', error);
        }
        return savedReservation;
    }
    async findAll(role, userId) {
        const query = this.reservationsRepository.createQueryBuilder('reservation')
            .leftJoinAndSelect('reservation.pack', 'pack')
            .leftJoinAndSelect('reservation.selectedOptions', 'options')
            .leftJoinAndSelect('reservation.user', 'user');
        if (role === 'CLIENT' && userId) {
            query.where('user.id = :userId', { userId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const reservation = await this.reservationsRepository.findOne({
            where: { id },
            relations: ['pack', 'selectedOptions', 'user'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation with ID ${id} not found`);
        }
        return reservation;
    }
    async updateStatus(id, status, internalNotes) {
        const reservation = await this.findOne(id);
        reservation.status = status;
        if (internalNotes) {
            reservation.internalNotes = internalNotes;
        }
        return this.reservationsRepository.save(reservation);
    }
    async uploadProof(id, userId, filePath) {
        const reservation = await this.findOne(id);
        if (reservation.user.id !== userId) {
            throw new common_1.BadRequestException('You do not have permission to upload proof for this reservation');
        }
        reservation.paymentProofUrl = filePath;
        reservation.status = reservation_status_enum_1.ReservationStatus.PAYMENT_PROOFS_SUBMITTED;
        return this.reservationsRepository.save(reservation);
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(pack_entity_1.Pack)),
    __param(2, (0, typeorm_1.InjectRepository)(pack_option_entity_1.PackOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        mail_service_1.MailService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map