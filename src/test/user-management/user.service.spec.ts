import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from 'src/user-management/application/services/user.service';
import { InMemoryUserRepository } from 'src/user-management/infrastructure/adapters/in-memory-user.repository';

describe('UserService', () => {
  let service: UserService;

  const mockKafkaClient = {
    emit: jest.fn(),
    connect: jest.fn(),
    subscribeToResponseOf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepositoryPort',
          useClass: InMemoryUserRepository,
        },
        {
          provide: 'KAFKA_CLIENT',
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should register, login, and change password', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const newPassword = 'newPassword';

    const user = await service.registerUser({ email, password });
    expect(user.email).toBe(email);

    const loginResult = await service.loginUser({ email, password });
    expect(loginResult.success).toBe(true);

    await service.changePassword({
      userId: user.id,
      oldPassword: password,
      newPassword,
    });

    const failedLogin = await service.loginUser({ email, password });
    expect(failedLogin.success).toBe(false);

    const successfulLogin = await service.loginUser({
      email,
      password: newPassword,
    });
    expect(successfulLogin.success).toBe(true);
  });
});
