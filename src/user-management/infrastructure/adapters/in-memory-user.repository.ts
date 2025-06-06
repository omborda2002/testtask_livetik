import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  private users = new Map<string, User>();

  async save(user: User): Promise<User> {
    await Promise.resolve(); // bcz, async operation
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    await Promise.resolve();
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    await Promise.resolve();
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }
}
