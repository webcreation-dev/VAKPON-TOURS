import { PacksService } from './packs.service';
import { CreatePackDto, CreatePackOptionDto } from './dto/pack.dto';
export declare class PacksController {
    private readonly packsService;
    constructor(packsService: PacksService);
    findAll(): Promise<import("./entities/pack.entity").Pack[]>;
    findAllAdmin(): Promise<import("./entities/pack.entity").Pack[]>;
    findOne(id: string): Promise<import("./entities/pack.entity").Pack>;
    create(createPackDto: CreatePackDto): Promise<import("./entities/pack.entity").Pack>;
    update(id: string, updatePackDto: Partial<CreatePackDto>): Promise<import("./entities/pack.entity").Pack>;
    remove(id: string): Promise<void>;
    addOption(packId: string, createOptionDto: CreatePackOptionDto): Promise<import("./entities/pack-option.entity").PackOption>;
    removeOption(optionId: string): Promise<void>;
}
