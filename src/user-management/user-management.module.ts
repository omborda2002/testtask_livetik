import { Module } from '@nestjs/common';
import { UserService } from './application/services/user.service';
import { UserController } from './interfaces/controllers/user.controller';
import { InMemoryUserRepository } from './infrastructure/adapters/in-memory-user.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user-client',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'user-client-group',
          },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepositoryPort',
      useClass: InMemoryUserRepository,
    },
  ],
})
export class UserManagementModule {}
