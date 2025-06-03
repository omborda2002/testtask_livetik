import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuditLogService } from './audit-log.service';

interface PasswordChangedEvent {
  userId: string;
  timestamp: string;
}

@Controller()
export class AuditLogController {
  constructor(private readonly auditService: AuditLogService) {}

  @EventPattern('user.events.auth')
  handlePasswordChangedEvent(@Payload() data: PasswordChangedEvent) {
    const { userId, timestamp } = data;
    this.auditService.logPasswordChange(userId, timestamp);
  }
}
