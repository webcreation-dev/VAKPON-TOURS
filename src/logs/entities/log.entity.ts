import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_logs')
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ type: 'int', nullable: true })
  statusCode: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User;

  @Column({ nullable: true })
  userEmail: string;

  @CreateDateColumn()
  createdAt: Date;
}
