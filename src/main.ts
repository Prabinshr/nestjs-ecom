import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as session from "express-session"
import * as passport from "passport"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Ecommerce ')
    .setDescription('The ecommerce API description')
    .setVersion('1.0')
    .addTag('ecommerce')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(session({
    secret:'secret',
    saveUninitialized:false,
    resave:false,
    cookie:{
      maxAge:60000
    }
  }))
  app.use(passport.session())
  app.use(passport.initialize())
  await app.listen(3000);
}
bootstrap();
