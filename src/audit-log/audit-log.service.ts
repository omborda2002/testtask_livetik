import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  logPasswordChange(userId: string, timestamp: string) {
    this.logger.log(
      `AUDIT: Password for user [${userId}] changed at [${timestamp}].`,
    );
  }
}
