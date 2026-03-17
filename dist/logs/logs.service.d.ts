import { Repository } from 'typeorm';
import { UserLog } from './entities/log.entity';
export declare class LogsService {
    private logsRepository;
    constructor(logsRepository: Repository<UserLog>);
    create(logData: Partial<UserLog>): Promise<UserLog>;
    findAll(filters: {
        userId?: string;
        email?: string;
        method?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<UserLog[]>;
}
