import { UserRole } from '../../common/enums/user-role.enum';
import { Reservation } from '../../reservations/entities/reservation.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    role: UserRole;
    isActive: boolean;
    reservations: Reservation[];
    createdAt: Date;
    updatedAt: Date;
}
