import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityDashboardService {
  private lastPasswordChanges = new Map<string, string>();

  updatePasswordChange(userId: string, timestamp: string) {
    this.lastPasswordChanges.set(userId, timestamp);
  }

  getLastPasswordChange(userId: string): string | null {
    return this.lastPasswordChanges.get(userId) || null;
  }
}
