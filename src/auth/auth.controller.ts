import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { LocalGuard } from './guards/local-auth/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Request() req) {
    return this.authService.sign(req.user);
  }

  @Get("google/login")
  @UseGuards(GoogleAuthGuard)
  handleLogin(){
    return {"msg":"Google Login"}
  }
  @Get("google/redirect")
  @UseGuards(GoogleAuthGuard)
  handleRedirect(){
    return {"msg":"Google Redirect"}
  }

  @Post("forget")
  async forgetPassword(@Body() body:{email:string}){
    return this.authService.forgetPassword(body.email)
  }
}
