import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pack } from '../../packs/entities/pack.entity';
import { PackOption } from '../../packs/entities/pack-option.entity';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reference: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ default: 1 })
  participantsCount: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePriceAtBooking: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  paymentProofUrl: string;

  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Pack, (pack) => pack.reservations)
  pack: Pack;

  @ManyToMany(() => PackOption)
  @JoinTable({ name: 'reservation_selected_options' })
  selectedOptions: PackOption[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
