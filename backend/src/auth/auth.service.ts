import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

import { DATABASE_CONNECTION } from '../database/database.module';
import { users, User, Schema } from '../../drizzle/schema';
import { AuthResponse, JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NeonHttpDatabase<Schema>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials
   */
  async validateUser(
    emailOrUsername: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: or(
        eq(users.email, emailOrUsername),
        eq(users.username, emailOrUsername),
      ),
    });

    if (!user || !user.isActive) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    return user;
  }

  /**
   * Login user and return JWT
   */
  async login(
    emailOrUsername: string,
    password: string,
  ): Promise<AuthResponse> {
    const user = await this.validateUser(emailOrUsername, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  /**
   * Create new user
   */
  async createUser(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.db.query.users.findFirst({
      where: or(eq(users.email, email), eq(users.username, username)),
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await this.db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
      })
      .returning();

    return newUser;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }
}
