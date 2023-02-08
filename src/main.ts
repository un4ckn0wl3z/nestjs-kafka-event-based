import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as os from 'os';
import { CustomLoggerService } from './framework/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { RequestHelperService } from './framework/helper/request.service';
export const GLOBAL_OS_NAME = os.hostname();
export let GLOBAL_KAFKA_LOGGER_INSTANCE: CustomLoggerService;
export let GLOBAL_REQUEST_HELPER_INSTANCE: RequestHelperService;
export let GLOBAL_CONFIG_INSTANCE: ConfigService;


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)
  GLOBAL_CONFIG_INSTANCE = configService
  const logger = app.get<CustomLoggerService>(CustomLoggerService);
  GLOBAL_REQUEST_HELPER_INSTANCE = app.get<RequestHelperService>(RequestHelperService);
  GLOBAL_KAFKA_LOGGER_INSTANCE = logger;
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
