import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TOKEN } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService:UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:TOKEN.JWT_SECRET
    });
  }
  async validate(payload:any){
    const user = await this.userService.findOne(payload.sub)
    if(!user) throw new UnauthorizedException()
    return user
  }
}
