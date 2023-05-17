import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { sendResetEmail } from './email';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService:JwtService,
    private mailerService:MailerService
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    if (createUserDto.email.includes(' ')) {
      throw new HttpException('Email cannot be space', 500);
    }
    const email = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: createUserDto.email.toLowerCase(),
          },
        ],
      },
    });

    if (email) {
      throw new HttpException('User already exist', 500);
    }
    const hashPassword = await argon.hash(createUserDto.password);
    createUserDto.password = hashPassword;
    
    const newUser = await this.prisma.user.create({ data: createUserDto });
    // const { password, ...result } = newUser;
    return this.sign(newUser);
  }

  sign(user:User){
    const accessToken = this.jwtService.sign({
      sub:user.id,
      email:user.email
    })
    return {accessToken:accessToken}
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user || (await argon.verify(user.password,password))) return user;
    return false;
  }

  async validateGoogleUser(detail:any){
    console.log("Auth Service")
    console.log(detail)

    const user = await this.userService.findOneByEmail(detail.email)

    if(user) return user

    const newUser = await this.userService.create(detail)

    return newUser
  }

  async findUser(id:string){
    const user = await this.userService.findOne(id)
    return user
  }

  async forgetPassword(email:string){
    const user = await this.userService.findOneByEmail(email)
    if(!user)  throw new HttpException("User has not found",500)

    const pass_reset_token =
      Math.floor(Math.random() * 9000000000) + 1000000000;
    const pass_reset_token_expires = Date.now() + 10 * 60 * 1000;

    const newResetPassword = await this.prisma.resetPassword.upsert({
      where: {
        email,
      },
      create: {
        email,
        pass_reset_token,
        pass_reset_token_expires,
      },
      update: {
        pass_reset_token,
        pass_reset_token_expires,
      },
    });
    // Sending Email with Reset Link
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'Ecommerce <no-reply@neptechpal.com>',
        subject: 'Reset Password Link',
        text: 'Click On The Button Below To Reset Password',
        html: `${sendResetEmail(newResetPassword.pass_reset_token)}`,
      });

      return {
        success: true,
        message: 'Reset Password Link Has Been Sent To Your Email',
      };
    } catch (e) {
      return {
        success: false,
        message: 'Something Went Wrong Sending Email',
      };
    }
  }
}
