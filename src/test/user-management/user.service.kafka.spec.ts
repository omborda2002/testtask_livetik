import { Test, TestingModule } from '@nestjs/testing';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { ChangePasswordDto } from 'src/user-management/application/dto/change-password.dto';
import { UserService } from 'src/user-management/application/services/user.service';
import { User } from 'src/user-management/domain/entities/user.entity';
import { InMemoryUserRepository } from 'src/user-management/infrastructure/adapters/in-memory-user.repository';

describe('UserService Kafka', () => {
  let service: UserService;
  let kafkaClientMock: { emit: jest.Mock };
  let module: TestingModule;

  beforeEach(async () => {
    kafkaClientMock = {
      emit: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepositoryPort',
          useClass: InMemoryUserRepository,
        },
        {
          provide: 'KAFKA_CLIENT',
          useValue: kafkaClientMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should emit PasswordChangedEvent on successful password change', async () => {
    // Create and insert user manually
    const repo = module.get<InMemoryUserRepository>('UserRepositoryPort');

    const id = uuidv4();
    const email = 'test@example.com';
    const password = await bcrypt.hash('oldpass', 10);
    const user = new User(id, email, password);
    await repo.save(user);

    const dto: ChangePasswordDto = {
      userId: id,
      oldPassword: 'oldpass',
      newPassword: 'newpass',
    };

    await service.changePassword(dto);

    expect(kafkaClientMock.emit).toHaveBeenCalledWith('user.events.auth', {
      userId: id,
      timestamp: expect.stringMatching(/.*/) as unknown as string,
    });
  });
});
