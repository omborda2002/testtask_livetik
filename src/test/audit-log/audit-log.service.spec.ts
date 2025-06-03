import { AuditLogService } from 'src/audit-log/audit-log.service';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new AuditLogService();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should log password change message', () => {
    const userId = 'user-123';
    const timestamp = new Date().toISOString();

    const spy = jest.spyOn<any, any>(service['logger'], 'log');
    service.logPasswordChange(userId, timestamp);

    expect(spy).toHaveBeenCalledWith(
      `AUDIT: Password for user [${userId}] changed at [${timestamp}].`,
    );
  });
});
