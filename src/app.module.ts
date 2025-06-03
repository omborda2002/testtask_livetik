import { Module } from '@nestjs/common';

import { UserManagementModule } from './user-management/user-management.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SecurityDashboardModule } from './security-dashboard/security-dashboard.module';

@Module({
  imports: [UserManagementModule, AuditLogModule, SecurityDashboardModule],
})
export class AppModule {}
