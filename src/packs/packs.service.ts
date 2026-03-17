import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pack } from './entities/pack.entity';
import { PackOption } from './entities/pack-option.entity';
import { CreatePackDto, CreatePackOptionDto } from './dto/pack.dto';

@Injectable()
export class PacksService {
  constructor(
    @InjectRepository(Pack)
    private packsRepository: Repository<Pack>,
    @InjectRepository(PackOption)
    private optionsRepository: Repository<PackOption>,
  ) {}

  async findAll(onlyPublished = true): Promise<Pack[]> {
    const query = this.packsRepository.createQueryBuilder('pack')
      .leftJoinAndSelect('pack.options', 'options');
    
    if (onlyPublished) {
      query.where('pack.isPublished = :isPublished', { isPublished: true });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Pack> {
    const pack = await this.packsRepository.findOne({
      where: { id },
      relations: ['options'],
    });
    if (!pack) {
      throw new NotFoundException(`Pack with ID ${id} not found`);
    }
    return pack;
  }

  async create(createPackDto: CreatePackDto): Promise<Pack> {
    const pack = this.packsRepository.create(createPackDto);
    return this.packsRepository.save(pack);
  }

  async update(id: string, updatePackDto: Partial<CreatePackDto>): Promise<Pack> {
    await this.findOne(id); // Ensure it exists
    await this.packsRepository.update(id, updatePackDto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const pack = await this.findOne(id);
    await this.packsRepository.remove(pack);
  }

  // --- Options Management ---

  async addOption(packId: string, createOptionDto: CreatePackOptionDto): Promise<PackOption> {
    const pack = await this.findOne(packId);
    const option = this.optionsRepository.create({
      ...createOptionDto,
      pack,
    });
    return this.optionsRepository.save(option);
  }

  async removeOption(optionId: string): Promise<void> {
    const option = await this.optionsRepository.findOne({ where: { id: optionId } });
    if (!option) {
      throw new NotFoundException(`Option with ID ${optionId} not found`);
    }
    await this.optionsRepository.remove(option);
  }
}
