import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as os from 'os';
import { CustomLoggerService } from './framework/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { LogDto } from './framework/logger/dtos/log.dto';
import { RequestHelperService } from './framework/helper/request.service';
import { Logger } from '@nestjs/common';
export const GLOBAL_OS_NAME = os.hostname();
export let GLOBAL_KAFKA_LOGGER_INSTANCE: CustomLoggerService;
export let GLOBAL_REQUEST_HELPER_INSTANCE: RequestHelperService;


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)
  const logger = app.get<CustomLoggerService>(CustomLoggerService);
  GLOBAL_REQUEST_HELPER_INSTANCE = app.get<RequestHelperService>(RequestHelperService);
  let logDto: LogDto;
   logDto = {
      type: 'detail',
      appName: configService.get<string>('app.name') || '#############',
      instance: GLOBAL_OS_NAME,
      channel: 'KAFKA'
  }
  
  GLOBAL_KAFKA_LOGGER_INSTANCE = logger;
  GLOBAL_KAFKA_LOGGER_INSTANCE.init(logDto);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: configService.get<Array<string>>('kafka.client.brokers'),
        clientId: configService.get<string>('kafka.client.client-id')
      },
      consumer: {
        groupId: configService.get<string>('kafka.consumer.group-id')
      }
    }
  });
  
  app.startAllMicroservices()
  
}

bootstrap();
