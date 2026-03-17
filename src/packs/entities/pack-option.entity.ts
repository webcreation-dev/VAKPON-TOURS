import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pack } from './pack.entity';

@Entity('pack_options')
export class PackOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Pack, (pack) => pack.options, { onDelete: 'CASCADE' })
  pack: Pack;
}
