import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

}
