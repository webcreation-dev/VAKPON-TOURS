import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/reservation.dto';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(createReservationDto: CreateReservationDto, req: any): Promise<import("./entities/reservation.entity").Reservation>;
    findMyReservations(req: any): Promise<import("./entities/reservation.entity").Reservation[]>;
    findAllAdmin(): Promise<import("./entities/reservation.entity").Reservation[]>;
    findOne(id: string, req: any): Promise<import("./entities/reservation.entity").Reservation>;
    updateStatus(id: string, status: ReservationStatus, internalNotes?: string): Promise<import("./entities/reservation.entity").Reservation>;
    uploadProof(id: string, file: Express.Multer.File, req: any): Promise<import("./entities/reservation.entity").Reservation>;
}
