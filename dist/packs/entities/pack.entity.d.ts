import { PackOption } from './pack-option.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
export declare class Pack {
    id: string;
    title: string;
    description: string;
    startingPrice: number;
    durationDays: number;
    includedServices: string[];
    isPublished: boolean;
    options: PackOption[];
    reservations: Reservation[];
    createdAt: Date;
    updatedAt: Date;
}
