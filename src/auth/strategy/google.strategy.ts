import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID:
        '703363801634-ln7uhu2b4kk5tc0dds0poqkc7as6jjir.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    console.log(accessToken, refreshToken, profile);

    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      fullname: profile.displayName,
    });

    console.log(user)
  }
}
