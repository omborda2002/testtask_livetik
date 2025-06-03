import { Controller, Get, Param } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { SecurityDashboardService } from './security-dashboard.service';

interface PasswordChangedEvent {
  userId: string;
  timestamp: string;
}

@Controller('dashboard')
export class SecurityDashboardController {
  constructor(private readonly service: SecurityDashboardService) {}

  @EventPattern('user.events.auth')
  handlePasswordChange(@Payload() data: PasswordChangedEvent) {
    const { userId, timestamp } = data;
    this.service.updatePasswordChange(userId, timestamp);
  }

  @Get('users/:userId/last-password-change')
  getLastPasswordChange(@Param('userId') userId: string) {
    return {
      userId,
      lastChangedAt: this.service.getLastPasswordChange(userId),
    };
  }
}
