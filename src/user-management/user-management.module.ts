import { Module } from '@nestjs/common';
import { UserController } from './interfaces/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { InMemoryUserRepository } from './infrastructure/adapters/in-memory-user.repository';

@Module({
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
