import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.email.includes(' ')) {
        throw new HttpException('Email cannot be space', 400);
      }
      const email = await this.prisma.user.findFirst({
        where: { OR: [{ email: createUserDto.email.toLowerCase() }] },
      });
      if (email) {
        throw new HttpException('Email already exist', 400);
      }

      const hashPassword = await argon.hash(createUserDto.password);
      createUserDto.password = hashPassword;

      const newUser = await this.prisma.user.create({ data: createUserDto });

      const { password, ...result } = newUser;
      return result;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();

      const userData = users.map((user) => {
        const { password, ...data } = user;
        return data;
      });
      return userData;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      const { password, ...data } = user;
      return data;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
  async findOneByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      return user;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await argon.hash(updateUserDto.password);
      }
      const user = await this.prisma.user.update({
        data: updateUserDto,
        where: { id },
      });
      const { password, ...updateUser } = user;
      return updateUser;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  async remove(id: string) {
    try {
      const remove = await this.prisma.user.delete({ where: { id } });
      return 'User has been deleted';
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
