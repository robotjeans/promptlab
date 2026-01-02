import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import type { AuthenticatedRequest } from './types';

class LoginDto {
  emailOrUsername: string;
  password: string;
}

class CreateUserDto {
  email: string;
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.emailOrUsername || !loginDto.password) {
      throw new BadRequestException('Email/username and password are required');
    }

    return this.authService.login(loginDto.emailOrUsername, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (
      !createUserDto.email ||
      !createUserDto.username ||
      !createUserDto.password
    ) {
      throw new BadRequestException(
        'Email, username, and password are required',
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate password strength (min 8 chars)
    if (createUserDto.password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    const user = await this.authService.createUser(
      createUserDto.email,
      createUserDto.username,
      createUserDto.password,
    );

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    };
  }
}
