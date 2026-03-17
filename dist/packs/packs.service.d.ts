import { Repository } from 'typeorm';
import { Pack } from './entities/pack.entity';
import { PackOption } from './entities/pack-option.entity';
import { CreatePackDto, CreatePackOptionDto } from './dto/pack.dto';
export declare class PacksService {
    private packsRepository;
    private optionsRepository;
    constructor(packsRepository: Repository<Pack>, optionsRepository: Repository<PackOption>);
    findAll(onlyPublished?: boolean): Promise<Pack[]>;
    findOne(id: string): Promise<Pack>;
    create(createPackDto: CreatePackDto): Promise<Pack>;
    update(id: string, updatePackDto: Partial<CreatePackDto>): Promise<Pack>;
    delete(id: string): Promise<void>;
    addOption(packId: string, createOptionDto: CreatePackOptionDto): Promise<PackOption>;
    removeOption(optionId: string): Promise<void>;
}
