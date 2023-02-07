import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'prisma/prisma.module';
import { EventConsumerController } from './consumer/event.consumer.controller';
import { EventProducerService } from './producer/event.producer.service';
import { UsersService } from './service/users.service';


@Module({
    imports: [
      PrismaModule,
        ClientsModule.register([
            {
              name: 'USER_PRODUCER',
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: 'user-producer',
                  brokers: ['134.209.108.174:9092'],
                },
                producer: {
                    allowAutoTopicCreation: true
                }
              }
            },
          ]),
    ],
    controllers: [EventConsumerController],
    providers: [EventProducerService,UsersService]
})
export class UsersModule {}
