import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!/^[a-zA-Z]+$/.test(dto.first_name)) {
      throw new BadRequestException('First name must contain letters only');
    }
    if (!/^[a-zA-Z]+$/.test(dto.last_name)) {
      throw new BadRequestException('Last name must contain letters only');
    }
    if (!/^[^\s@]+@[^\s@]+\.(com|net|org|id)$/.test(dto.email)) {
      throw new BadRequestException('Email must end with .com, .net, .org, or .id');
    }
    if (dto.password.includes(' ')) {
      throw new BadRequestException('Password cannot contain spaces');
    }
    if (dto.password.length < 8) {
      throw new BadRequestException('Password must have at least 8 characters');
    }
    if ((dto.password.match(/[0-9]/g) || []).length < 2) {
      throw new BadRequestException('Password must contain at least 2 numeric digits');
    }
    const existingUser = await this.prisma.users.findFirst({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    await this.prisma.users.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password: dto.password,
        role: 'CUSTOMER',
      },
    });
    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findFirst({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    if (user.password !== dto.password) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
  }
}