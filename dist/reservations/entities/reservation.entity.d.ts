import { User } from '../../users/entities/user.entity';
import { Pack } from '../../packs/entities/pack.entity';
import { PackOption } from '../../packs/entities/pack-option.entity';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
export declare class Reservation {
    id: string;
    reference: string;
    startDate: Date;
    participantsCount: number;
    status: ReservationStatus;
    basePriceAtBooking: number;
    totalPrice: number;
    paymentProofUrl: string;
    internalNotes: string;
    user: User;
    pack: Pack;
    selectedOptions: PackOption[];
    createdAt: Date;
    updatedAt: Date;
}
