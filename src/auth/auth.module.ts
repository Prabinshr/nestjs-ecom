import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN } from 'config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { SessionSerializer } from './strategy/serializer';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '3d' },
      secret: TOKEN.JWT_SECRET,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'jedediah32@ethereal.email',
          pass: '3hKawmsJDtBHTuM18n',
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
