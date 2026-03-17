import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLog } from './entities/log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(UserLog)
    private logsRepository: Repository<UserLog>,
  ) {}

  async create(logData: Partial<UserLog>): Promise<UserLog> {
    const log = this.logsRepository.create(logData);
    return this.logsRepository.save(log);
  }

  async findAll(filters: {
    userId?: string;
    email?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<UserLog[]> {
    const query = this.logsRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC');

    if (filters.userId) {
      query.andWhere('user.id = :userId', { userId: filters.userId });
    }

    if (filters.email) {
      query.andWhere('log.userEmail = :email', { email: filters.email });
    }

    if (filters.method) {
      query.andWhere('log.method = :method', { method: filters.method });
    }

    if (filters.startDate) {
      query.andWhere('log.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('log.createdAt <= :endDate', { endDate: filters.endDate });
    }

    return query.getMany();
  }
}
