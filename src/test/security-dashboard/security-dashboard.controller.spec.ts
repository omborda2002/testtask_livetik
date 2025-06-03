import { Test, TestingModule } from '@nestjs/testing';

import { SecurityDashboardController } from 'src/security-dashboard/security-dashboard.controller';
import { SecurityDashboardService } from 'src/security-dashboard/security-dashboard.service';

describe('SecurityDashboardController', () => {
  let controller: SecurityDashboardController;
  let service: SecurityDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityDashboardController],
      providers: [SecurityDashboardService],
    }).compile();

    controller = module.get<SecurityDashboardController>(
      SecurityDashboardController,
    );
    service = module.get<SecurityDashboardService>(SecurityDashboardService);
  });

  it('should handle PasswordChangedEvent and update timestamp', () => {
    const spy = jest.spyOn(service, 'updatePasswordChange');
    const event = {
      userId: 'user-123',
      timestamp: new Date().toISOString(),
    };

    controller.handlePasswordChange(event);

    expect(spy).toHaveBeenCalledWith(event.userId, event.timestamp);
  });

  it('should return last password change timestamp for a user', () => {
    const userId = 'user-abc';
    const timestamp = new Date().toISOString();

    service.updatePasswordChange(userId, timestamp);

    const result = controller.getLastPasswordChange(userId);
    expect(result).toEqual({
      userId,
      lastChangedAt: timestamp,
    });
  });
});
