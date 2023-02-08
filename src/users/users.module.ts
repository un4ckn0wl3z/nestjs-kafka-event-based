import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'prisma/prisma.module';
import { EventConsumerController } from './consumer/event.consumer.controller';
import { EventProducerService } from './producer/event.producer.service';
import { PhotosApiService } from './service/photo-api.service';
import { UsersService } from './service/users.service';


@Module({
    imports: [
      PrismaModule,
      ClientsModule.registerAsync(
        [
          {
            name: 'USER_PRODUCER',
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: 'user-producer',
                  brokers: config.get<Array<string>>('kafka.client.brokers'),
                },
                producer: {
                  allowAutoTopicCreation: true
                }
              },
            }),
          },
        ]
      ),
    ],
    controllers: [EventConsumerController],
    providers: [EventProducerService,UsersService,PhotosApiService]
})
export class UsersModule {}
