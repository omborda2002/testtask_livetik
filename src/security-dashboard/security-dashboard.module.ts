import { Module } from '@nestjs/common';

import { SecurityDashboardService } from './security-dashboard.service';
import { SecurityDashboardController } from './security-dashboard.controller';

@Module({
  providers: [SecurityDashboardService],
  controllers: [SecurityDashboardController],
})
export class SecurityDashboardModule {}
