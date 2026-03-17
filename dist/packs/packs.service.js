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
exports.PacksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pack_entity_1 = require("./entities/pack.entity");
const pack_option_entity_1 = require("./entities/pack-option.entity");
let PacksService = class PacksService {
    packsRepository;
    optionsRepository;
    constructor(packsRepository, optionsRepository) {
        this.packsRepository = packsRepository;
        this.optionsRepository = optionsRepository;
    }
    async findAll(onlyPublished = true) {
        const query = this.packsRepository.createQueryBuilder('pack')
            .leftJoinAndSelect('pack.options', 'options');
        if (onlyPublished) {
            query.where('pack.isPublished = :isPublished', { isPublished: true });
        }
        return query.getMany();
    }
    async findOne(id) {
        const pack = await this.packsRepository.findOne({
            where: { id },
            relations: ['options'],
        });
        if (!pack) {
            throw new common_1.NotFoundException(`Pack with ID ${id} not found`);
        }
        return pack;
    }
    async create(createPackDto) {
        const pack = this.packsRepository.create(createPackDto);
        return this.packsRepository.save(pack);
    }
    async update(id, updatePackDto) {
        await this.findOne(id);
        await this.packsRepository.update(id, updatePackDto);
        return this.findOne(id);
    }
    async delete(id) {
        const pack = await this.findOne(id);
        await this.packsRepository.remove(pack);
    }
    async addOption(packId, createOptionDto) {
        const pack = await this.findOne(packId);
        const option = this.optionsRepository.create({
            ...createOptionDto,
            pack,
        });
        return this.optionsRepository.save(option);
    }
    async removeOption(optionId) {
        const option = await this.optionsRepository.findOne({ where: { id: optionId } });
        if (!option) {
            throw new common_1.NotFoundException(`Option with ID ${optionId} not found`);
        }
        await this.optionsRepository.remove(option);
    }
};
exports.PacksService = PacksService;
exports.PacksService = PacksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pack_entity_1.Pack)),
    __param(1, (0, typeorm_1.InjectRepository)(pack_option_entity_1.PackOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PacksService);
//# sourceMappingURL=packs.service.js.map