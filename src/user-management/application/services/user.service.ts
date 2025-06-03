import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,

    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('user.events.auth');
    await this.kafkaClient.connect();
  }

  async registerUser(dto: RegisterUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new Error('User already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = new User(randomUUID(), dto.email, hash);
    return this.userRepository.save(user);
  }

  async loginUser(
    dto: LoginUserDto,
  ): Promise<{ success: boolean; userId?: string; error?: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) return { success: false, error: 'User not found' };

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    return isValid
      ? { success: true, userId: user.id }
      : { success: false, error: 'Invalid password' };
  }

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isValid) throw new Error('Old password incorrect');

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);

    // Emiting Kafka event
    const event = {
      userId: user.id,
      timestamp: new Date().toISOString(),
    };
    this.kafkaClient.emit('user.events.auth', event);
  }
}
