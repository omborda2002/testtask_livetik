import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [UserManagementModule, AuditLogModule],
})
export class AppModule {}
