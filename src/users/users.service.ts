import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // ✅ নতুন user তৈরি
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;

    // duplicate email check
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
    });

    // password ছাড়া return
    const { password: _, ...result } = user;
    return {
      message: 'User registered successfully',
      ...result,
    };
  }

  // ✅ login / auth এর জন্য ব্যবহার হবে
  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        createdAt: true,
        role: true,
      },
    });
  }

  // ✅ profile এর জন্য password বাদ দিয়ে ব্যবহার হবে
  async findByIdWithoutPassword(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) return null;

    const { password, ...result } = user;
    return result;
  }
}
