import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PackOption } from './pack-option.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('packs')
export class Pack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  startingPrice: number;

  @Column()
  durationDays: number;

  @Column('simple-array', { nullable: true })
  includedServices: string[];

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => PackOption, (option) => option.pack, { cascade: true })
  options: PackOption[];

  @OneToMany(() => Reservation, (reservation) => reservation.pack)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
