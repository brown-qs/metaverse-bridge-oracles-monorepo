import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule, utilities as winstonUtilities } from 'nest-winston';
import * as winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { StackTraceErrorFilter } from './filters/stack-trace-error.filter';

//server will crash, if a controller/service calls an async function from outside the class and that function throws, will be unhandledRejection and crash app on node v15 and higher
process.on('unhandledRejection', (reason: any, promise) => {
  console.log('Unhandled Rejection at:', reason?.stack || reason)
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
      //format: winston.format.combine(winston.format.timestamp(), nestLikeConsoleFormat()),
      format: winston.format.combine(winston.format.timestamp(), winstonUtilities.format.nestLike()),
      transports: [new winston.transports.Console()]
    })
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new StackTraceErrorFilter(httpAdapter))
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  const options = new DocumentBuilder()
    .setTitle('Moonsama Multiverse Oracle')
    .setDescription(`Oracle of the Moonsama Multiverse Portal`)
    .setVersion('1.0')
    .addBearerAuth({ scheme: 'bearer', type: 'http' })
    .addApiKey({ type: 'apiKey', in: 'header', name: 'AuthenticationHeader' }, 'AuthenticationHeader')
    .addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/v1/docs', app, document);

  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get<string>('server.port'));
}
bootstrap();
