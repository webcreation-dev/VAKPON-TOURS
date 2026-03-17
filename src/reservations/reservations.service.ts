import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Pack } from '../packs/entities/pack.entity';
import { PackOption } from '../packs/entities/pack-option.entity';
import { User } from '../users/entities/user.entity';
import { CreateReservationDto } from './dto/reservation.dto';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Pack)
    private packsRepository: Repository<Pack>,
    @InjectRepository(PackOption)
    private optionsRepository: Repository<PackOption>,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  async create(createReservationDto: CreateReservationDto, user: User): Promise<Reservation> {
    const { packId, optionIds, startDate, participantsCount } = createReservationDto;

    // 1. Fetch the pack
    const pack = await this.packsRepository.findOne({
      where: { id: packId },
      relations: ['options'],
    });

    if (!pack) {
      throw new NotFoundException(`Pack with ID ${packId} not found`);
    }

    // 2. Validate and fetch options
    let selectedOptions: PackOption[] = [];
    let optionsTotal = 0;

    if (optionIds && optionIds.length > 0) {
      selectedOptions = await this.optionsRepository.createQueryBuilder('option')
        .where('option.id IN (:...ids)', { ids: optionIds })
        .andWhere('option.packId = :packId', { packId }) // Ensure options belong to this pack
        .getMany();

      if (selectedOptions.length !== optionIds.length) {
        throw new BadRequestException('Some selected options are invalid or do not belong to this pack');
      }

      optionsTotal = selectedOptions.reduce((sum, opt) => sum + Number(opt.price), 0);
    }

    // 3. Calculate total price
    const basePrice = Number(pack.startingPrice);
    const totalPrice = basePrice + optionsTotal;

    // 4. Generate reference (Format: VT-YYYYMMDD-RANDOM)
    const reference = `VT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 5. Create reservation
    const reservation = this.reservationsRepository.create({
      reference,
      startDate: new Date(startDate),
      participantsCount,
      status: ReservationStatus.PENDING,
      basePriceAtBooking: basePrice,
      totalPrice: totalPrice,
      user,
      pack,
      selectedOptions,
    });

    const savedReservation = await this.reservationsRepository.save(reservation);
    
    // Notify Admin
    try {
      await this.mailService.sendAdminReservationNotification(savedReservation);
    } catch (error) {
      console.error('Failed to send admin notification', error);
    }

    return savedReservation;
  }

  async findAll(role: string, userId?: string): Promise<Reservation[]> {
    const query = this.reservationsRepository.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.pack', 'pack')
      .leftJoinAndSelect('reservation.selectedOptions', 'options')
      .leftJoinAndSelect('reservation.user', 'user');

    if (role === 'CLIENT' && userId) {
      query.where('user.id = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['pack', 'selectedOptions', 'user'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async updateStatus(id: string, status: ReservationStatus, internalNotes?: string): Promise<Reservation> {
    const reservation = await this.findOne(id);
    reservation.status = status;
    if (internalNotes) {
      reservation.internalNotes = internalNotes;
    }
    return this.reservationsRepository.save(reservation);
  }

  async uploadProof(id: string, userId: string, filePath: string): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    // Check if user owns the reservation or is admin
    if (reservation.user.id !== userId) {
      throw new BadRequestException('You do not have permission to upload proof for this reservation');
    }

    reservation.paymentProofUrl = filePath;
    reservation.status = ReservationStatus.PAYMENT_PROOFS_SUBMITTED;
    
    return this.reservationsRepository.save(reservation);
  }
}
