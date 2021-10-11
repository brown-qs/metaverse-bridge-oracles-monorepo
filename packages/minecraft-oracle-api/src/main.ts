import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { nestLikeConsoleFormat } from './utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
      format: winston.format.combine(winston.format.timestamp(), nestLikeConsoleFormat()),
      transports: [new winston.transports.Console()]
    })
  });

  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  const options = new DocumentBuilder()
    .setTitle('Moonsama Minecraft Oracle')
    .setDescription(`Oracle for the Minecraft Moonriver bridge of the Moonsama metaverse`)
    .setVersion('1.0')
    .addBearerAuth({scheme: 'bearer', type: 'http'})
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/v1/docs', app, document);

  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get<string>('server.port'));
}
bootstrap();
