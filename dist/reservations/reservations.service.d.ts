import { Repository, DataSource } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Pack } from '../packs/entities/pack.entity';
import { PackOption } from '../packs/entities/pack-option.entity';
import { User } from '../users/entities/user.entity';
import { CreateReservationDto } from './dto/reservation.dto';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { MailService } from '../mail/mail.service';
export declare class ReservationsService {
    private reservationsRepository;
    private packsRepository;
    private optionsRepository;
    private dataSource;
    private mailService;
    constructor(reservationsRepository: Repository<Reservation>, packsRepository: Repository<Pack>, optionsRepository: Repository<PackOption>, dataSource: DataSource, mailService: MailService);
    create(createReservationDto: CreateReservationDto, user: User): Promise<Reservation>;
    findAll(role: string, userId?: string): Promise<Reservation[]>;
    findOne(id: string): Promise<Reservation>;
    updateStatus(id: string, status: ReservationStatus, internalNotes?: string): Promise<Reservation>;
    uploadProof(id: string, userId: string, filePath: string): Promise<Reservation>;
}
