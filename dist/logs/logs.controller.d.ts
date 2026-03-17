import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    findAll(userId?: string, email?: string, method?: string, startDate?: string, endDate?: string): Promise<import("./entities/log.entity").UserLog[]>;
}
