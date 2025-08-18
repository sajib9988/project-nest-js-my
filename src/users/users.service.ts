import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async createUser(createUserDto: CreateUserDto) {
        const {name, email, password } = createUserDto;

        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const user = await this.prismaService.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Return user without password
        const { password: _, ...result } = user;
        return result;
    }
}
